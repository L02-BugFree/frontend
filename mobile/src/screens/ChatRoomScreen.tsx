import { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  StatusBar, ScrollView, StyleSheet, Platform,
  KeyboardAvoidingView, Animated, Pressable,
} from "react-native";
import type { Conversation, GroupMember } from "./MainChatScreen";

// ─── Types ────────────────────────────────────────────────────────────────────
type MsgType = "text" | "voice" | "card" | "checklist";

interface CheckItem { id: string; label: string; done: boolean; assignees: string[] }

interface Msg {
  id: string;
  type: MsgType;
  text?: string;
  voiceDuration?: string;
  cardTitle?: string; cardSub?: string;
  checklistTitle?: string; checklistItems?: CheckItem[];
  senderId?: string;   // which member sent (group only)
  reaction?: string;
  isMine: boolean;
  time: string;
  dateLabel?: string;
}

// ─── Group mock messages ──────────────────────────────────────────────────────
const GROUP_MSGS: Msg[] = [
  {
    id:"g1", type:"text",
    text:"Tụi mình họp lúc mấy giờ vậy?",
    senderId:"m1", isMine:false, time:"09:10",
    dateLabel:"Hôm nay, 12 tháng 4",
  },
  {
    id:"g2", type:"text",
    text:"Chừa ra 26 người/36 nhân viên không tham gia lịch trình.",
    senderId:"m2", isMine:false, time:"09:12",
  },
  {
    id:"g3", type:"text",
    text:"Để t check lịch của mng cái rồi báo sau nha 😅",
    isMine:true, time:"09:13",
  },
  {
    id:"g4", type:"checklist",
    checklistTitle:"Checklist Assignment 2",
    checklistItems:[
      { id:"t1", label:"Hoàn thành task 1", done:true,  assignees:["QV","HA"] },
      { id:"t2", label:"Hoàn thành task 2", done:false, assignees:["MT"] },
      { id:"t3", label:"Hoàn thành task 3", done:false, assignees:["BC","QV"] },
    ],
    senderId:"m3", isMine:false, time:"09:20",
  },
  {
    id:"g5", type:"text",
    text:"Tốt lắm! Ai làm xong task 1 chưa?",
    isMine:true, time:"09:22",
  },
  {
    id:"g6", type:"text",
    text:"T xong rồi nè 🙌",
    senderId:"m1", isMine:false, time:"09:23", reaction:"👍",
  },
  {
    id:"g7", type:"checklist",
    checklistTitle:"Checklist Assignment 3",
    checklistItems:[
      { id:"t4", label:"Hoàn thành task 1", done:true,  assignees:["QV"] },
      { id:"t5", label:"Hoàn thành task 2", done:true,  assignees:["HA","MT"] },
      { id:"t6", label:"Chốt deadline",      done:false, assignees:["BC"] },
    ],
    senderId:"m4", isMine:false, time:"09:30",
  },
];

// ─── DM mock messages ─────────────────────────────────────────────────────────
const DM_MSGS: Msg[] = [
  { id:"d1", type:"text", text:"Tui làm xong phần task 1 rồi..", isMine:false, time:"10:20", dateLabel:"12 tháng 4" },
  { id:"d2", type:"text", text:"Hmmm! Hình như thiếu ở DoD nha", isMine:true, time:"10:21" },
  { id:"d3", type:"voice", voiceDuration:"0:07", isMine:true, time:"10:22" },
  { id:"d4", type:"text", text:"T thêm vô bảng r ó?", isMine:false, time:"10:25", dateLabel:"12 tháng 4 lúc 10:24" },
  { id:"d5", type:"card", cardTitle:"dribbble.com/shots/21436621...", cardSub:"Ở xem còn chỉnh sửa gì ko?", isMine:false, time:"10:26" },
  { id:"d6", type:"text", text:"Okie! Để xíu rảnh t check", isMine:true, time:"10:28" },
];

// ─── Waveform ─────────────────────────────────────────────────────────────────
const BARS = [4, 8, 12, 6, 14, 8, 12, 5, 10, 7, 13, 6, 10, 8, 11, 5, 9, 7, 12, 6];
function Waveform({ mine }: { mine: boolean }) {
  return (
    <View style={wf.row}>
      {BARS.map((h, i) => (
        <View key={i} style={[wf.bar, { height: h, backgroundColor: mine ? "#fff" : "#0866FF", opacity: i < 10 ? 1 : 0.5 }]} />
      ))}
    </View>
  );
}
const wf = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 2.5 },
  bar: { width: 2.5, borderRadius: 2 },
});

// ─── Card Message ─────────────────────────────────────────────────────────────
function CardMsg({ title, sub }: { title?: string; sub?: string }) {
  return (
    <View style={cm.card}>
      <View style={cm.img}>
        <Text style={cm.emoji}>🎨</Text>
        <View style={cm.badge}><Text style={cm.badgeTxt}>drib</Text></View>
      </View>
      {title && <Text style={cm.link} numberOfLines={1}>{title}</Text>}
      {sub   && <Text style={cm.sub}>{sub}</Text>}
    </View>
  );
}
const cm = StyleSheet.create({
  card: { width: 210, borderRadius: 16, overflow: "hidden", backgroundColor: "#EEF2FF" },
  img:  { height: 110, backgroundColor: "#D6E0FF", alignItems: "center", justifyContent: "center", position: "relative" },
  emoji: { fontSize: 36 },
  badge: { position:"absolute", bottom:8, left:10, backgroundColor:"#0866FF", borderRadius:6, paddingHorizontal:8, paddingVertical:3 },
  badgeTxt: { color:"#fff", fontSize:11, fontWeight:"700" },
  link: { fontSize:11, color:"#9FA3B3", paddingHorizontal:12, paddingTop:8 },
  sub:  { fontSize:13, color:"#1A1D2E", paddingHorizontal:12, paddingBottom:12, paddingTop:4 },
});

// ─── Checklist Card ───────────────────────────────────────────────────────────
function ChecklistCard({
  title, items, members,
}: {
  title?: string;
  items?: CheckItem[];
  members?: GroupMember[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries((items ?? []).map(i => [i.id, i.done]))
  );
  const memberMap = Object.fromEntries((members ?? []).map(m => [m.initials, m]));

  return (
    <View style={cl.card}>
      {/* Header */}
      <View style={cl.header}>
        <Text style={cl.icon}>✅</Text>
        <Text style={cl.title}>{title}</Text>
      </View>

      {/* Items */}
      {(items ?? []).map(item => (
        <TouchableOpacity
          key={item.id}
          style={cl.row}
          onPress={() => setChecked(p => ({ ...p, [item.id]: !p[item.id] }))}
          activeOpacity={0.7}
        >
          <View style={[cl.checkbox, checked[item.id] && cl.checkboxDone]}>
            {checked[item.id] && <Text style={cl.tick}>✓</Text>}
          </View>
          <Text style={[cl.label, checked[item.id] && cl.labelDone]} numberOfLines={1}>
            {item.label}
          </Text>
          {/* Assignee mini-avatars */}
          <View style={cl.assignees}>
            {item.assignees.slice(0, 3).map((initials, i) => {
              const m = memberMap[initials];
              return (
                <View
                  key={i}
                  style={[cl.assigneeAvatar, { backgroundColor: m?.color ?? "#999", marginLeft: i > 0 ? -6 : 0 }]}
                >
                  <Text style={cl.assigneeText}>{initials}</Text>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>
      ))}

      {/* Footer */}
      <View style={cl.footer}>
        <Text style={cl.footerTxt}>
          {Object.values(checked).filter(Boolean).length}/{items?.length ?? 0} hoàn thành
        </Text>
      </View>
    </View>
  );
}
const cl = StyleSheet.create({
  card: {
    backgroundColor: "#fff", borderRadius: 16, overflow: "hidden",
    borderWidth: 1, borderColor: "#E8EEFF", width: 240,
    ...Platform.select({
      ios: { shadowColor:"#0866FF", shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:8 },
      android: { elevation: 3 },
      default: {},
    }),
  },
  header: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#EEF2FF", paddingHorizontal: 14, paddingVertical: 10,
  },
  icon: { fontSize: 16 },
  title: { fontSize: 13, fontWeight: "700", color: "#1A1D2E", flex: 1 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "#F0F2F8",
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 4,
    borderWidth: 1.5, borderColor: "#C0C4D6",
    alignItems: "center", justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#0866FF", borderColor: "#0866FF" },
  tick: { fontSize: 11, color: "#fff", fontWeight: "700" },
  label: { fontSize: 12, color: "#1A1D2E", flex: 1 },
  labelDone: { color: "#9FA3B3", textDecorationLine: "line-through" },
  assignees: { flexDirection: "row" },
  assigneeAvatar: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "#fff",
  },
  assigneeText: { fontSize: 7, fontWeight: "700", color: "#fff" },
  footer: {
    backgroundColor: "#F7F8FA", paddingHorizontal: 14, paddingVertical: 8,
  },
  footerTxt: { fontSize: 11, color: "#0866FF", fontWeight: "600" },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatRoomScreen({
  conversation, onBack, onOpenSchedule,
}: {
  conversation: Conversation;
  onBack?: () => void;
  onOpenSchedule?: () => void;
}) {
  const isGroup = !!conversation.isGroup;
  const members = conversation.members ?? [];
  const memberMap = Object.fromEntries(members.map(m => [m.id, m]));

  const initMsgs = isGroup ? GROUP_MSGS : DM_MSGS;
  const [msgs, setMsgs] = useState<Msg[]>(initMsgs);
  const [text, setText]  = useState("");
  const [mic, setMic]    = useState(false);
  const scrollRef         = useRef<ScrollView>(null);
  const pulseAnim         = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [msgs]);

  useEffect(() => {
    if (mic) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 450, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 450, useNativeDriver: true }),
      ]));
      loop.start();
      return () => { loop.stop(); pulseAnim.setValue(1); };
    }
  }, [mic]);

  const sendText = () => {
    if (!text.trim()) return;
    setMsgs(p => [...p, {
      id: Date.now().toString(), type:"text",
      text: text.trim(), isMine: true,
      time: new Date().toLocaleTimeString("vi-VN", { hour:"2-digit", minute:"2-digit" }),
    }]);
    setText("");
  };

  const renderMsg = (msg: Msg, idx: number) => {
    const prev = idx > 0 ? msgs[idx - 1] : null;
    const prevSame = prev && prev.isMine === msg.isMine && prev.senderId === msg.senderId;
    const isFirst = !prevSame;

    // For group: look up sender
    const sender = msg.senderId ? memberMap[msg.senderId] : null;
    const avatarColor = sender?.color ?? conversation.color;
    const avatarInitials = sender?.initials ?? conversation.initials;

    return (
      <View key={msg.id}>
        {/* Date separator */}
        {msg.dateLabel && (
          <View style={s.dateSep}>
            <View style={s.dateLine} />
            <Text style={s.dateText}>{msg.dateLabel}</Text>
            <View style={s.dateLine} />
          </View>
        )}

        <View style={[s.row, msg.isMine ? s.rowRight : s.rowLeft, { marginTop: isFirst ? 10 : 2 }]}>
          {/* Left avatar (theirs) */}
          {!msg.isMine && (
            <View style={[s.avatar, { backgroundColor: avatarColor }, !isFirst && s.invis]}>
              <Text style={s.avatarTxt}>{avatarInitials}</Text>
            </View>
          )}

          <View style={[s.group, msg.isMine && { alignItems: "flex-end" }]}>
            {/* Sender name (group only, first in group) */}
            {isGroup && !msg.isMine && isFirst && sender && (
              <Text style={[s.senderName, { color: sender.color }]}>{sender.name}</Text>
            )}

            {/* TEXT */}
            {msg.type === "text" && (
              <View style={[s.bubble, msg.isMine ? s.mine : s.theirs]}>
                <Text style={[s.bubbleTxt, msg.isMine && { color: "#fff" }]}>{msg.text}</Text>
              </View>
            )}

            {/* VOICE */}
            {msg.type === "voice" && (
              <View style={[s.bubble, s.voiceBubble, msg.isMine ? s.mine : s.theirs]}>
                <TouchableOpacity style={s.playBtn}>
                  <Text style={{ fontSize: 11, color: "#fff" }}>▶</Text>
                </TouchableOpacity>
                <Waveform mine={msg.isMine} />
                <Text style={{ fontSize: 11, color: msg.isMine ? "rgba(255,255,255,0.7)" : "#9FA3B3" }}>
                  {msg.voiceDuration}
                </Text>
              </View>
            )}

            {/* CARD */}
            {msg.type === "card" && (
              <CardMsg title={msg.cardTitle} sub={msg.cardSub} />
            )}

            {/* CHECKLIST */}
            {msg.type === "checklist" && (
              <ChecklistCard
                title={msg.checklistTitle}
                items={msg.checklistItems}
                members={members}
              />
            )}

            {/* Reaction */}
            {msg.reaction && (
              <View style={[s.reaction, msg.isMine && { alignSelf: "flex-end" }]}>
                <Text style={s.reactionText}>{msg.reaction}</Text>
              </View>
            )}

            <Text style={s.time}>{msg.time}</Text>
          </View>

          {/* Right avatar spacer (mine) */}
          {msg.isMine && <View style={s.avatarSpacer} />}
        </View>
      </View>
    );
  };

  // Group header: stacked avatars
  const renderGroupAvatars = () => {
    if (!isGroup || members.length === 0) return null;
    return (
      <View style={s.groupAvatarStack}>
        {members.slice(0, 3).map((m, i) => (
          <View key={m.id} style={[s.hdrStackAvatar, { backgroundColor: m.color, marginLeft: i > 0 ? -8 : 0 }]}>
            <Text style={s.hdrStackTxt}>{m.initials}</Text>
          </View>
        ))}
        {members.length > 3 && (
          <View style={[s.hdrStackAvatar, { backgroundColor: "#9FA3B3", marginLeft: -8 }]}>
            <Text style={s.hdrStackTxt}>+{members.length - 3}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={onBack} style={s.backBtn} hitSlop={{ top:12, bottom:12, left:12, right:12 }}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
            {isGroup ? renderGroupAvatars() : (
              <View style={[s.hdrAvatar, { backgroundColor: conversation.color }]}>
                <Text style={s.hdrAvatarTxt}>{conversation.initials}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.hdrName} numberOfLines={1}>{conversation.name}</Text>
              {isGroup ? (
                <Text style={s.hdrSub}>{members.length} thành viên</Text>
              ) : conversation.isOnline ? (
                <Text style={s.hdrOnline}>● Đang hoạt động</Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity style={s.menuBtn}>
            <Text style={s.menuIcon}>⋮</Text>
          </TouchableOpacity>

          {/* Calendar shortcut for groups */}
          {isGroup && (
            <TouchableOpacity
              style={[s.menuBtn, { marginLeft: -4 }]}
              onPress={onOpenSchedule}
              hitSlop={{top:8,bottom:8,left:8,right:8}}
            >
              <Text style={{ fontSize: 20 }}>📅</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={s.list} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
          {msgs.map((m, i) => renderMsg(m, i))}
          <View style={{ height: 12 }} />
        </ScrollView>

        {/* Input Bar */}
        <View style={s.inputBar}>
          <TouchableOpacity style={s.attachBtn}>
            <Text style={s.attachIcon}>＋</Text>
          </TouchableOpacity>
          <View style={s.inputBox}>
            <TextInput
              style={s.textField}
              placeholder={isGroup ? "Nhắn tin nhóm..." : "Nhập tin nhắn..."}
              placeholderTextColor="#BCBEC8"
              value={text}
              onChangeText={setText}
              multiline
            />
          </View>
          {text.trim().length > 0 ? (
            <TouchableOpacity style={s.sendBtn} onPress={sendText}>
              <Text style={s.sendIcon}>➤</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View style={{ transform: [{ scale: mic ? pulseAnim : 1 }] }}>
              <Pressable style={[s.micBtn, mic && s.micActive]} onPressIn={() => setMic(true)} onPressOut={() => setMic(false)}>
                <Text style={{ fontSize: 18 }}>🎙️</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE = "#0866FF";
const DARK = "#1A1D2E";
const MUTED = "#9FA3B3";
const EDGE = "#F0F2F8";

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  // Header
  header: {
    flexDirection:"row", alignItems:"center", gap:10,
    paddingHorizontal:16, paddingVertical:12,
    backgroundColor:"#fff", borderBottomWidth:1, borderBottomColor:EDGE,
  },
  backBtn: { width:32, alignItems:"center" },
  backArrow: { fontSize:22, color:DARK, lineHeight:28 },
  groupAvatarStack: { flexDirection:"row", alignItems:"center" },
  hdrStackAvatar: {
    width:32, height:32, borderRadius:16,
    alignItems:"center", justifyContent:"center",
    borderWidth:1.5, borderColor:"#fff",
  },
  hdrStackTxt: { fontSize:10, fontWeight:"700", color:"#fff" },
  hdrAvatar: { width:40, height:40, borderRadius:20, alignItems:"center", justifyContent:"center" },
  hdrAvatarTxt: { fontSize:14, fontWeight:"700", color:"#fff" },
  hdrName: { fontSize:15, fontWeight:"600", color:DARK },
  hdrSub: { fontSize:11, color:MUTED, marginTop:1 },
  hdrOnline: { fontSize:11, color:"#27AE60", fontWeight:"500", marginTop:1 },
  menuBtn: { width:32, alignItems:"center" },
  menuIcon: { fontSize:22, color:DARK },

  // Messages
  list: { flex:1 },
  listContent: { paddingHorizontal:14, paddingTop:10 },
  dateSep: { flexDirection:"row", alignItems:"center", gap:8, marginVertical:12 },
  dateLine: { flex:1, height:1, backgroundColor:EDGE },
  dateText: { fontSize:11, color:MUTED },

  row: { flexDirection:"row", alignItems:"flex-end", gap:8 },
  rowRight: { justifyContent:"flex-end" },
  rowLeft:  { justifyContent:"flex-start" },

  avatar: {
    width:28, height:28, borderRadius:14,
    alignItems:"center", justifyContent:"center", marginBottom:18,
  },
  avatarTxt: { fontSize:10, fontWeight:"700", color:"#fff" },
  avatarSpacer: { width:4 },
  invis: { opacity:0 },

  group: { maxWidth:"74%", gap:3 },
  senderName: { fontSize:11, fontWeight:"600", marginBottom:2, marginLeft:2 },

  bubble: { borderRadius:18, paddingHorizontal:14, paddingVertical:10 },
  mine: { backgroundColor:BLUE, borderBottomRightRadius:4 },
  theirs: {
    backgroundColor:"#fff", borderBottomLeftRadius:4,
    ...Platform.select({
      ios:{ shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.07, shadowRadius:4 },
      android:{ elevation:1 },
      default:{},
    }),
  },
  bubbleTxt: { fontSize:14, color:DARK, lineHeight:21 },

  voiceBubble: {
    flexDirection:"row", alignItems:"center",
    gap:8, paddingVertical:12, minWidth:180,
  },
  playBtn: {
    width:28, height:28, borderRadius:14,
    backgroundColor:"rgba(255,255,255,0.28)",
    alignItems:"center", justifyContent:"center",
  },

  reaction: {
    backgroundColor:"#fff", borderRadius:10,
    paddingHorizontal:6, paddingVertical:2,
    alignSelf:"flex-start", marginTop:-4,
    borderWidth:1, borderColor:EDGE,
  },
  reactionText: { fontSize:13 },

  time: { fontSize:10, color:MUTED, marginTop:2, alignSelf:"flex-end" },

  // Input
  inputBar: {
    flexDirection:"row", alignItems:"center",
    paddingHorizontal:12, paddingVertical:10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    backgroundColor:"#fff", borderTopWidth:1, borderTopColor:EDGE, gap:8,
  },
  attachBtn: {
    width:40, height:40, borderRadius:20,
    backgroundColor:"#EEF2FF", alignItems:"center", justifyContent:"center",
  },
  attachIcon: { fontSize:22, color:BLUE, fontWeight:"300", marginTop:-2 },
  inputBox: {
    flex:1, minHeight:44, maxHeight:120,
    backgroundColor:"#F5F6FA", borderRadius:22,
    paddingHorizontal:16, paddingVertical:8, justifyContent:"center",
  },
  textField: { fontSize:14, color:DARK },
  sendBtn: {
    width:40, height:40, borderRadius:20,
    backgroundColor:BLUE, alignItems:"center", justifyContent:"center",
  },
  sendIcon: { fontSize:14, color:"#fff" },
  micBtn: {
    width:40, height:40, borderRadius:20,
    backgroundColor:"#EEF2FF", alignItems:"center", justifyContent:"center",
  },
  micActive: { backgroundColor:"#FFE8E8" },
});
