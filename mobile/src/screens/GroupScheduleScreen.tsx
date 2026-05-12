import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, SafeAreaView, StatusBar,
  ScrollView, StyleSheet, Platform, Modal, Pressable, TextInput,
} from "react-native";
import type { Conversation, GroupMember } from "./MainChatScreen";
import { scheduleApi, type HeatmapSlot } from "../constants/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScheduleBlock {
  memberId: string;
  dayIndex: number;   // 0 = Mon … 6 = Sun
  startSlot: number;  // 0-based slot index (each slot = 30 min, starting 07:00)
  span: number;       // how many slots tall
}

interface PollOption {
  id: string;
  label: string;
  dayIndex: number;
  startSlot: number;
  span: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DAY_DATES = ["21", "22", "23", "24", "25", "26", "27"]; // April 2026 week

// Time labels: 07:00 → 21:00, every hour
const HOUR_LABELS = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00",
                     "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
const SLOT_HEIGHT = 22; // px per 30-min slot
const SLOTS_PER_HOUR = 2;
const TOTAL_SLOTS = HOUR_LABELS.length * SLOTS_PER_HOUR; // 30 slots

// ─── Mock schedule data ───────────────────────────────────────────────────────
const BLOCKS: ScheduleBlock[] = [
  // QV – Mon, Tue busy mornings
  { memberId:"m1", dayIndex:0, startSlot:2, span:4 },
  { memberId:"m1", dayIndex:1, startSlot:4, span:3 },
  { memberId:"m1", dayIndex:3, startSlot:6, span:5 },
  { memberId:"m1", dayIndex:4, startSlot:2, span:6 },
  // HA – overlaps
  { memberId:"m2", dayIndex:0, startSlot:5, span:4 },
  { memberId:"m2", dayIndex:2, startSlot:2, span:6 },
  { memberId:"m2", dayIndex:4, startSlot:6, span:4 },
  { memberId:"m2", dayIndex:5, startSlot:2, span:5 },
  // MT
  { memberId:"m3", dayIndex:1, startSlot:2, span:6 },
  { memberId:"m3", dayIndex:3, startSlot:2, span:4 },
  { memberId:"m3", dayIndex:4, startSlot:10, span:3 },
  { memberId:"m3", dayIndex:6, startSlot:4, span:5 },
  // BC
  { memberId:"m4", dayIndex:0, startSlot:10, span:4 },
  { memberId:"m4", dayIndex:2, startSlot:8, span:5 },
  { memberId:"m4", dayIndex:5, startSlot:6, span:6 },
];

const DEFAULT_POLL_OPTIONS: PollOption[] = [
  { id:"p1", label:"Tên lịch 1", dayIndex:3, startSlot:4, span:4 },
  { id:"p2", label:"Tên lịch 2", dayIndex:4, startSlot:2, span:4 },
  { id:"p3", label:"Tên lịch 3", dayIndex:5, startSlot:6, span:4 },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function slotToTime(slot: number): string {
  const totalMin = 7 * 60 + slot * 30;
  const h = Math.floor(totalMin / 60).toString().padStart(2, "0");
  const m = (totalMin % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function timeToSlot(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return Math.max(0, (h - 7) * 2 + Math.floor((m || 0) / 30));
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GroupScheduleScreen({
  conversation, onBack,
}: {
  conversation: Conversation;
  onBack?: () => void;
}) {
  const members = conversation.members ?? [];
  const memberMap = Object.fromEntries(members.map(m => [m.id, m]));

  const [showPollModal, setShowPollModal] = useState(false);
  const [pollOptions, setPollOptions]     = useState<PollOption[]>(DEFAULT_POLL_OPTIONS);
  const [pollTitle, setPollTitle]         = useState("Họp nhóm tuần 4");
  const [confirmed, setConfirmed]         = useState(false);
  const [blocks, setBlocks]               = useState<ScheduleBlock[]>(BLOCKS);

  // Fetch real heatmap when available
  useEffect(() => {
    if (!conversation.id || !conversation.isGroup) return;
    scheduleApi.heatmap(conversation.id)
      .then((slots: HeatmapSlot[]) => {
        if (!slots?.length) return;
        const nameToId = Object.fromEntries(members.map(m => [m.name, m.id]));
        const converted: ScheduleBlock[] = slots.flatMap(slot =>
          (slot.members ?? []).map(name => ({
            memberId: nameToId[name] ?? members[0]?.id ?? "m1",
            dayIndex: Math.max(0, slot.dayOfWeek - 1),
            startSlot: timeToSlot(slot.startTime),
            span: Math.max(1, timeToSlot(slot.endTime) - timeToSlot(slot.startTime)),
          }))
        );
        if (converted.length > 0) setBlocks(converted);
      })
      .catch(() => { /* keep mock data */ });
  }, [conversation.id]);

  const addOption = () => {
    const n = pollOptions.length + 1;
    setPollOptions(p => [...p, { id: `p${n}`, label: `Tên lịch ${n}`, dayIndex: n % 7, startSlot: 4, span: 4 }]);
  };

  const CELL_WIDTH = 42; // px per day column
  const TIME_COL   = 44;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn} hitSlop={{top:12,bottom:12,left:12,right:12}}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.hdrTitle}>Lịch nhóm</Text>
          <Text style={s.hdrSub}>{conversation.name}</Text>
        </View>
        <TouchableOpacity style={s.searchBtn}>
          <Text style={s.searchIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowPollModal(true)}>
          <Text style={s.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ── Week Navigation ── */}
      <View style={s.weekNav}>
        <TouchableOpacity style={s.navArrow}><Text style={s.navArrowTxt}>‹</Text></TouchableOpacity>
        <Text style={s.weekLabel}>tháng 4 / 2026</Text>
        <TouchableOpacity style={s.navArrow}><Text style={s.navArrowTxt}>›</Text></TouchableOpacity>
      </View>

      {/* ── Member Legend ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.legendRow}>
        {members.map(m => (
          <View key={m.id} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: m.color }]} />
            <Text style={s.legendName}>{m.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ── Calendar Grid ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Day header row */}
        <View style={[s.dayHeaderRow, { paddingLeft: TIME_COL }]}>
          {DAYS.map((d, i) => (
            <View key={d} style={[s.dayHeader, { width: CELL_WIDTH }]}>
              <Text style={s.dayLetter}>{d}</Text>
              <Text style={s.dayDate}>{DAY_DATES[i]}</Text>
            </View>
          ))}
        </View>

        {/* Grid body */}
        <View style={{ flexDirection: "row" }}>
          {/* Time labels column */}
          <View style={{ width: TIME_COL }}>
            {HOUR_LABELS.map((lbl, i) => (
              <View key={lbl} style={[s.timeLabel, { height: SLOT_HEIGHT * SLOTS_PER_HOUR }]}>
                <Text style={s.timeTxt}>{lbl}</Text>
              </View>
            ))}
          </View>

          {/* Day columns with schedule blocks */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            {DAYS.map((_, dayIdx) => (
              <View key={dayIdx} style={[s.dayColumn, { width: CELL_WIDTH, height: TOTAL_SLOTS * SLOT_HEIGHT }]}>
                {/* Hour grid lines */}
                {HOUR_LABELS.map((_, hi) => (
                  <View key={hi} style={[s.gridLine, { top: hi * SLOTS_PER_HOUR * SLOT_HEIGHT }]} />
                ))}

                {/* Member schedule blocks */}
                {blocks.filter(b => b.dayIndex === dayIdx).map((b, bi) => {
                  const member = memberMap[b.memberId];
                  if (!member) return null;
                  return (
                    <View
                      key={bi}
                      style={[s.block, {
                        top: b.startSlot * SLOT_HEIGHT,
                        height: b.span * SLOT_HEIGHT - 2,
                        backgroundColor: member.color + "40",
                        borderLeftColor: member.color,
                      }]}
                    >
                      <Text style={[s.blockTxt, { color: member.color }]} numberOfLines={2}>
                        {member.initials}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FAB: Tạo bình chọn ── */}
      <TouchableOpacity style={s.fab} onPress={() => setShowPollModal(true)} activeOpacity={0.85}>
        <Text style={s.fabIcon}>📅</Text>
        <Text style={s.fabTxt}>Tạo bình chọn</Text>
      </TouchableOpacity>

      {/* ── Poll Modal ── */}
      <Modal visible={showPollModal} transparent animationType="slide" onRequestClose={() => setShowPollModal(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setShowPollModal(false)}>
          <Pressable style={s.modalSheet} onPress={() => {}}>
            {/* Handle */}
            <View style={s.handle} />

            <Text style={s.modalTitle}>Tạo bình chọn lịch</Text>

            {/* Poll title input */}
            <TextInput
              style={s.pollTitleInput}
              value={pollTitle}
              onChangeText={setPollTitle}
              placeholder="Tên bình chọn..."
              placeholderTextColor="#BCBEC8"
            />

            {/* Poll options label */}
            <Text style={s.sectionLabel}>Mảng bình chọn</Text>

            {/* Options list */}
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {pollOptions.map((opt, i) => (
                <View key={opt.id} style={s.optionRow}>
                  <View style={s.optionDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.optionLabel}>{opt.label}</Text>
                    <Text style={s.optionTime}>
                      {DAYS[opt.dayIndex]} {DAY_DATES[opt.dayIndex]}/04  •  {slotToTime(opt.startSlot)} – {slotToTime(opt.startSlot + opt.span)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setPollOptions(p => p.filter((_, j) => j !== i))}>
                    <Text style={s.optionDel}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Add option */}
            <TouchableOpacity style={s.addOptionBtn} onPress={addOption}>
              <Text style={s.addOptionTxt}>Thêm lịch  →</Text>
            </TouchableOpacity>

            <View style={s.divider} />

            {/* Date display */}
            <View style={s.dateRow}>
              <Text style={s.dateIcon}>📅</Text>
              <Text style={s.dateTxt}>24/04/2026</Text>
              <View style={{ flex: 1 }} />
              <View style={s.toggleRow}>
                <TouchableOpacity style={s.toggleChip}><Text style={s.toggleTxt}>Thứ</Text></TouchableOpacity>
                <TouchableOpacity style={[s.toggleChip, s.toggleActive]}><Text style={[s.toggleTxt, s.toggleActiveTxt]}>Tiếu</Text></TouchableOpacity>
              </View>
            </View>

            {/* Confirm button */}
            <TouchableOpacity
              style={[s.confirmBtn, confirmed && s.confirmDone]}
              onPress={() => { setConfirmed(true); setTimeout(() => { setShowPollModal(false); setConfirmed(false); }, 800); }}
              activeOpacity={0.85}
            >
              <Text style={s.confirmTxt}>{confirmed ? "✓ Đã gửi!" : "Xác nhận lịch bình chọn"}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE = "#0866FF";
const DARK = "#1A1D2E";
const MUTED = "#9FA3B3";
const EDGE = "#F0F2F8";

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection:"row", alignItems:"center", gap:10,
    paddingHorizontal:16, paddingVertical:12,
    borderBottomWidth:1, borderBottomColor:EDGE,
  },
  backBtn: { width:32, alignItems:"center" },
  backArrow: { fontSize:22, color:DARK, lineHeight:28 },
  hdrTitle: { fontSize:16, fontWeight:"700", color:DARK },
  hdrSub: { fontSize:11, color:MUTED, marginTop:1 },
  searchBtn: { width:36, height:36, borderRadius:18, backgroundColor:"#F5F6FA", alignItems:"center", justifyContent:"center" },
  searchIcon: { fontSize:16 },
  addBtn: { width:36, height:36, borderRadius:18, backgroundColor:BLUE, alignItems:"center", justifyContent:"center" },
  addIcon: { fontSize:22, color:"#fff", lineHeight:28 },

  // Week nav
  weekNav: {
    flexDirection:"row", alignItems:"center", justifyContent:"center",
    paddingVertical:10, gap:16,
  },
  navArrow: { width:32, height:32, alignItems:"center", justifyContent:"center" },
  navArrowTxt: { fontSize:22, color:DARK, lineHeight:28 },
  weekLabel: { fontSize:14, fontWeight:"600", color:DARK },

  // Legend
  legendRow: { paddingHorizontal:16, gap:12, paddingBottom:10 },
  legendItem: { flexDirection:"row", alignItems:"center", gap:5 },
  legendDot: { width:10, height:10, borderRadius:5 },
  legendName: { fontSize:11, color:DARK, fontWeight:"500" },

  // Calendar grid
  dayHeaderRow: { flexDirection:"row", paddingBottom:6, borderBottomWidth:1, borderBottomColor:EDGE },
  dayHeader: { alignItems:"center", gap:2 },
  dayLetter: { fontSize:11, color:MUTED, fontWeight:"500" },
  dayDate: { fontSize:13, fontWeight:"700", color:DARK },
  timeLabel: {
    justifyContent:"flex-start", paddingTop:2, paddingRight:8,
    borderBottomWidth:1, borderBottomColor:EDGE,
  },
  timeTxt: { fontSize:10, color:MUTED, textAlign:"right" },
  dayColumn: { position:"relative", borderLeftWidth:1, borderLeftColor:EDGE },
  gridLine: { position:"absolute", left:0, right:0, height:1, backgroundColor:EDGE },
  block: {
    position:"absolute", left:1, right:1,
    borderRadius:4, borderLeftWidth:3,
    paddingHorizontal:3, paddingVertical:2,
  },
  blockTxt: { fontSize:8, fontWeight:"700" },

  // FAB
  fab: {
    position:"absolute", bottom:24, alignSelf:"center",
    flexDirection:"row", alignItems:"center", gap:8,
    backgroundColor:BLUE, borderRadius:28,
    paddingHorizontal:20, paddingVertical:13,
    ...Platform.select({
      ios:{ shadowColor:BLUE, shadowOffset:{width:0,height:6}, shadowOpacity:0.4, shadowRadius:12 },
      android:{ elevation:8 },
      default:{},
    }),
  },
  fabIcon: { fontSize:18 },
  fabTxt: { fontSize:14, fontWeight:"600", color:"#fff" },

  // Modal
  modalOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.45)", justifyContent:"flex-end" },
  modalSheet: {
    backgroundColor:"#fff", borderTopLeftRadius:24, borderTopRightRadius:24,
    paddingHorizontal:20, paddingBottom: Platform.OS === "ios" ? 40 : 24, paddingTop:12,
  },
  handle: { width:40, height:4, borderRadius:2, backgroundColor:"#D1D5DB", alignSelf:"center", marginBottom:20 },
  modalTitle: { fontSize:17, fontWeight:"700", color:DARK, marginBottom:14 },
  pollTitleInput: {
    height:44, borderWidth:1.5, borderColor:EDGE, borderRadius:10,
    paddingHorizontal:14, fontSize:14, color:DARK, backgroundColor:"#F7F8FA",
    marginBottom:16,
  },
  sectionLabel: { fontSize:12, fontWeight:"600", color:MUTED, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 },
  optionRow: {
    flexDirection:"row", alignItems:"center", gap:10,
    paddingVertical:10, borderBottomWidth:1, borderBottomColor:EDGE,
  },
  optionDot: { width:8, height:8, borderRadius:4, backgroundColor:BLUE },
  optionLabel: { fontSize:14, fontWeight:"600", color:DARK },
  optionTime: { fontSize:11, color:MUTED, marginTop:2 },
  optionDel: { fontSize:16, color:"#CCC", paddingHorizontal:4 },
  addOptionBtn: { paddingVertical:12 },
  addOptionTxt: { fontSize:13, color:BLUE, fontWeight:"600" },
  divider: { height:1, backgroundColor:EDGE, marginVertical:12 },
  dateRow: { flexDirection:"row", alignItems:"center", gap:8, marginBottom:16 },
  dateIcon: { fontSize:16 },
  dateTxt: { fontSize:14, color:DARK, fontWeight:"500" },
  toggleRow: { flexDirection:"row", gap:6 },
  toggleChip: {
    paddingHorizontal:12, paddingVertical:5,
    borderRadius:20, borderWidth:1.5, borderColor:EDGE,
  },
  toggleActive: { backgroundColor:BLUE, borderColor:BLUE },
  toggleTxt: { fontSize:12, color:MUTED, fontWeight:"500" },
  toggleActiveTxt: { color:"#fff" },
  confirmBtn: {
    height:52, backgroundColor:BLUE, borderRadius:14,
    alignItems:"center", justifyContent:"center",
  },
  confirmDone: { backgroundColor:"#27AE60" },
  confirmTxt: { fontSize:15, fontWeight:"700", color:"#fff" },
});
