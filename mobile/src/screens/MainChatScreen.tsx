import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GroupMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  color: string;
  isOnline?: boolean;
  isGroup?: boolean;
  lastMsg: string;
  time: string;
  unread?: number;
  members?: GroupMember[];
}

export interface Story {
  id: string;
  name: string;
  initials: string;
  color: string;
  isNew?: boolean;
}

interface MainChatScreenProps {
  onOpenChat?: (c: Conversation) => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STORIES: Story[] = [
  { id: "s1", name: "Quốc Việt", initials: "QV", color: "#F5A623", isNew: true },
  { id: "s2", name: "Nhóm App",  initials: "NA", color: "#0866FF", isNew: true },
  { id: "s3", name: "John",      initials: "JW", color: "#9B59B6" },
  { id: "s4", name: "Monica",    initials: "MR", color: "#27AE60" },
  { id: "s5", name: "Harry",     initials: "HS", color: "#E74C3C" },
];

const CONVS: Conversation[] = [
  { id:"c1", name:"Quốc Việt",      initials:"QV", color:"#F5A623", isOnline:true, lastMsg:"Tui làm xong phần task 1 rồi..", time:"2 min",  unread:2 },
  {
    id:"c2", name:"Nhóm Mobile App", initials:"NA", color:"#0866FF", isGroup:true,
    lastMsg:"Bạn: Để t check lịch của mng cái..", time:"12 min",
    members: [
      { id:"m1", name:"Quốc Việt", initials:"QV", color:"#F5A623" },
      { id:"m2", name:"Hoàng Anh", initials:"HA", color:"#E74C3C" },
      { id:"m3", name:"Minh Tuấn", initials:"MT", color:"#27AE60" },
      { id:"m4", name:"Bảo Châu",  initials:"BC", color:"#9B59B6" },
    ],
  },
  { id:"c3", name:"John Walton",     initials:"JW", color:"#9B59B6", lastMsg:"I am sending you a parcel rece..", time:"08 feb" },
  { id:"c4", name:"Monica Randawa", initials:"MR", color:"#27AE60", lastMsg:"Hope you're doing well today..", time:"02 feb" },
  { id:"c5", name:"Innoxent Jay",   initials:"IJ", color:"#E67E22", lastMsg:"Let's get back to the work, You..", time:"25 jan" },
  { id:"c6", name:"Harry Samit",    initials:"HS", color:"#E74C3C", lastMsg:"Listen dude, I have a problem..", time:"18 jan" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MainChatScreen({ onOpenChat }: MainChatScreenProps) {
  const [search, setSearch]     = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const filtered = CONVS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { key: "chat",   label: "Chat",    emoji: "💬" },
    { key: "lich",   label: "Lịch",    emoji: "📅" },
    { key: "sukien", label: "Sự kiện", emoji: "🔔" },
    { key: "hoso",   label: "Hồ sơ",   emoji: "👤" },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>NexTime</Text>
        <TouchableOpacity style={s.iconBtn}>
          <Text style={s.iconBtnText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#BCBEC8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={s.filterBtn}>
          <Text style={s.filterIcon}>⊞</Text>
        </TouchableOpacity>
      </View>

      {/* Stories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.storiesContent}
      >
        {/* Add button */}
        <TouchableOpacity style={s.storyCol}>
          <View style={s.addCircle}>
            <Text style={s.addPlus}>+</Text>
          </View>
          <Text style={s.storyLabel}>Thêm</Text>
        </TouchableOpacity>

        {STORIES.map((st) => (
          <TouchableOpacity key={st.id} style={s.storyCol}>
            <View style={[
              s.storyCircle,
              { backgroundColor: st.color },
              st.isNew && s.storyNew,
            ]}>
              <Text style={s.storyInitials}>{st.initials}</Text>
            </View>
            <Text style={s.storyLabel} numberOfLines={1}>{st.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section title */}
      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>Tin nhắn</Text>
        <TouchableOpacity>
          <Text style={s.sectionMore}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Conversation list */}
      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={s.convRow}
            onPress={() => onOpenChat?.(conv)}
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <View style={s.avatarWrap}>
              <View style={[s.avatar, { backgroundColor: conv.color }]}>
                <Text style={s.avatarText}>
                  {conv.isGroup ? "👥" : conv.initials}
                </Text>
              </View>
              {conv.isOnline && <View style={s.dot} />}
            </View>

            {/* Text */}
            <View style={s.convInfo}>
              <View style={s.convTop}>
                <Text style={s.convName} numberOfLines={1}>{conv.name}</Text>
                <Text style={[
                  s.convTime,
                  conv.unread ? s.convTimeBlue : null,
                ]}>
                  {conv.time}
                </Text>
              </View>
              <View style={s.convBot}>
                <Text style={s.convMsg} numberOfLines={1}>{conv.lastMsg}</Text>
                {!!conv.unread && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{conv.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={s.tabBar}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={s.tabItem}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              {active && <View style={s.tabIndicator} />}
              <Text style={[s.tabEmoji, active && s.tabEmojiActive]}>
                {tab.emoji}
              </Text>
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE = "#0866FF";
const DARK = "#1A1D2E";
const MUTED = "#9FA3B3";
const BORDER = "#F0F2F8";

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 12,
  },
  logo: { fontSize: 22, fontWeight: "800", color: DARK, letterSpacing: -0.5 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#F5F6FA",
    alignItems: "center", justifyContent: "center",
  },
  iconBtnText: { fontSize: 16 },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  searchBox: {
    flex: 1, height: 44, flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F6FA", borderRadius: 14,
    paddingHorizontal: 14, gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: DARK },
  filterBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "#F5F6FA",
    alignItems: "center", justifyContent: "center",
  },
  filterIcon: { fontSize: 18, color: DARK },

  // Stories
  storiesContent: { paddingHorizontal: 16, gap: 14, paddingBottom: 4 },
  storyCol: { alignItems: "center", gap: 5, width: 60 },
  addCircle: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: "#F0F4FF",
    borderWidth: 2, borderColor: "#C8D8FF", borderStyle: "dashed",
    alignItems: "center", justifyContent: "center",
  },
  addPlus: { fontSize: 24, color: BLUE, lineHeight: 28 },
  storyCircle: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: "center", justifyContent: "center",
  },
  storyNew: { borderWidth: 2.5, borderColor: BLUE },
  storyInitials: { fontSize: 17, fontWeight: "700", color: "#fff" },
  storyLabel: { fontSize: 10, color: DARK, fontWeight: "500", textAlign: "center" },

  // Section
  sectionRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, marginTop: 16, marginBottom: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: DARK },
  sectionMore: { fontSize: 13, color: BLUE, fontWeight: "500" },

  // List
  list: { flex: 1 },
  convRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 11, gap: 12,
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  dot: {
    position: "absolute", bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: "#2ECC71", borderWidth: 2, borderColor: "#fff",
  },
  convInfo: { flex: 1 },
  convTop: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", gap: 6,
  },
  convName: { fontSize: 15, fontWeight: "600", color: DARK, flex: 1 },
  convTime: { fontSize: 12, color: MUTED },
  convTimeBlue: { color: BLUE, fontWeight: "600" },
  convBot: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 2,
  },
  convMsg: { fontSize: 13, color: MUTED, flex: 1 },
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: BLUE, paddingHorizontal: 5,
    alignItems: "center", justifyContent: "center",
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1, borderTopColor: BORDER,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    backgroundColor: "#fff",
  },
  tabItem: { flex: 1, alignItems: "center", gap: 3, position: "relative" },
  tabIndicator: {
    position: "absolute", top: -9,
    width: 28, height: 3, borderRadius: 2, backgroundColor: BLUE,
  },
  tabEmoji: { fontSize: 20, opacity: 0.4 },
  tabEmojiActive: { opacity: 1 },
  tabLabel: { fontSize: 11, color: MUTED, fontWeight: "500" },
  tabLabelActive: { color: BLUE, fontWeight: "700" },
});
