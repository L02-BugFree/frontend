import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Color, BoxShadow, StyleVariable } from "../styles/GlobalStyles";

// --- Components ---

// --- ChatContent ---
const ChatContent = () => {
  return (
    <View style={styles_ChatContent.chatContent}>
      <View style={styles_ChatContent.userMessages}>
        <View style={styles_ChatContent.recentMessage}>
          <Pressable
            style={[styles_ChatContent.ellipseParent, styles_ChatContent.frameGroupFlexBox]}
            onPress={() => {}}
          >
            <View />
            <View
              style={[
                styles_ChatContent.avatarIconWrapper,
                styles_ChatContent.messageActionsSpaceBlock,
              ]}
            >
              <View />
            </View>
            <View style={[styles_ChatContent.messageHeader, styles_ChatContent.messageHeaderLayout]}>
              <View style={styles_ChatContent.userLabel}>
                <Text style={[styles_ChatContent.qucVit, styles_ChatContent.qucVitTypo]}>
                  Quốc Việt
                </Text>
                <View style={styles_ChatContent.statusIndicator}>
                  <View style={styles_ChatContent.statusIconContainer}>
                    <View />
                    <Text style={[styles_ChatContent.userStatus, styles_ChatContent.qucVitTypo]}>
                      2
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles_ChatContent.tuiLmXong, styles_ChatContent.bnTTypo]}>
                Tui làm xong phần task 1 rồi..
              </Text>
            </View>
          </Pressable>
          <View
            style={[styles_ChatContent.messageActions, styles_ChatContent.messageActionsSpaceBlock]}
          >
            <View style={styles_ChatContent.marParent}>
              <Text style={[styles_ChatContent.mar, styles_ChatContent.marTypo1]}>29 mar</Text>
              <Text style={[styles_ChatContent.mar2, styles_ChatContent.marTypo1]}>29 mar</Text>
            </View>
          </View>
        </View>
        <View style={styles_ChatContent.frameParent}>
          <Pressable
            style={[styles_ChatContent.frameGroup, styles_ChatContent.framePosition]}
            onPress={() => {}}
          >
            <View
              style={[
                styles_ChatContent.avatarIconWrapper,
                styles_ChatContent.messageActionsSpaceBlock,
              ]}
            >
              <View style={[styles_ChatContent.ellipseGroup, styles_ChatContent.frameLayout]}>
                <View />
                <Pressable
                  style={[styles_ChatContent.wrapper, styles_ChatContent.framePosition]}
                  onPress={() => {}}
                >
                  <View />
                </Pressable>
              </View>
            </View>
            <View
              style={[styles_ChatContent.nhmMobileAppParent, styles_ChatContent.messageHeaderLayout]}
            >
              <Text style={[styles_ChatContent.nhmMobileApp, styles_ChatContent.qucVitTypo]}>
                Nhóm Mobile App
              </Text>
              <Text style={[styles_ChatContent.bnT, styles_ChatContent.bnTTypo]}>
                Bạn: Để t check lịch của mng cái..
              </Text>
            </View>
          </Pressable>
          <View style={styles_ChatContent.marGroup}>
            <Text style={[styles_ChatContent.mar3, styles_ChatContent.marTypo]}>12 mar</Text>
            <Text style={[styles_ChatContent.mar4, styles_ChatContent.marTypo]}>12 mar</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles_ChatContent = StyleSheet.create({
  frameGroupFlexBox: {
    gap: 23,
    flexDirection: "row",
  },
  frameLayout: {
    height: 50,
    width: 50,
  },
  messageActionsSpaceBlock: {
    paddingTop: 1,
    width: 50,
  },
  messageHeaderLayout: {
    gap: 3,
    height: 54,
    
  },
  qucVitTypo: {
    textAlign: "left",
    fontFamily: "Poppins",
  },
  bnTTypo: {
    fontSize: 16,
    height: 24,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
  },
  marTypo1: {
    width: 53,
    color: "#c5bdbd",
    fontSize: 14,
    left: 0,
    top: 0,
    position: "absolute",
    height: 21,
    textAlign: "left",
    fontFamily: "Poppins",
  },
  framePosition: {
    left: 0,
    top: 0,
    position: "absolute",
  },
  marTypo: {
    width: 49,
    color: "#c5bdbd",
    fontSize: 14,
    left: 0,
    top: 0,
    position: "absolute",
    height: 21,
    textAlign: "left",
    fontFamily: "Poppins",
  },
  chatContent: {
    width: 376,
    height: 173,
    justifyContent: "flex-end",
    paddingRight: 22,
    paddingBottom: 30,
    flexDirection: "row",
    
  },
  userMessages: {
    height: 143,
    gap: 36,
    width: 354,
    
  },
  recentMessage: {
    width: 353,
    zIndex: 3,
    gap: 1,
    height: 53,
    flexDirection: "row",
  },
  ellipseParent: {
    width: 302,
    paddingTop: 0,
    zIndex: 3,
    height: 53,
  },
  frameChild: {
    display: "none",
    width: 50,
  },
  avatarIconWrapper: {
    height: 51,
    
  },
  avatarIcon: {
    width: 50,
  },
  messageHeader: {
    width: 229,
  },
  userLabel: {
    width: 154,
    gap: 50,
    zIndex: 1,
    height: 27,
    flexDirection: "row",
  },
  qucVit: {
    width: 90,
    zIndex: 1,
    color: Color.lightLabelPrimary,
    fontWeight: "500",
    fontSize: 18,
    textAlign: "left",
    fontFamily: "Poppins",
    height: 27,
  },
  statusIndicator: {
    paddingTop: 6,
    height: 21,
    width: 14,
  },
  statusIconContainer: {
    zIndex: 4,
    height: 15,
    width: 14,
    flexDirection: "row",
  },
  statusIcon: {
    height: 14,
    color: "#55a99d",
    zIndex: 4,
    width: 14,
  },
  userStatus: {
    width: 9,
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    zIndex: 5,
    marginLeft: -10,
    height: 15,
    textAlign: "left",
    fontFamily: "Poppins",
  },
  tuiLmXong: {
    color: "#9c9797",
    width: 229,
  },
  messageActions: {
    height: 22,
  },
  marParent: {
    height: 21,
    zIndex: 1,
    width: 50,
  },
  mar: {
    zIndex: 1,
  },
  mar2: {
    zIndex: 2,
  },
  frameParent: {
    zIndex: 1,
    height: 54,
    width: 354,
  },
  frameGroup: {
    width: 340,
    zIndex: 1,
    height: 54,
    gap: 23,
    flexDirection: "row",
  },
  ellipseGroup: {
    zIndex: 2,
    width: 50,
  },
  frameItem: {
    width: 50,
    height: 50,
  },
  wrapper: {
    zIndex: 2,
    width: 50,
    height: 50,
  },
  icon: {
    width: "100%",
    height: "100%",
    
    
  },
  nhmMobileAppParent: {
    width: 267,
  },
  nhmMobileApp: {
    width: 165,
    color: Color.lightLabelPrimary,
    fontWeight: "500",
    fontSize: 18,
    textAlign: "left",
    fontFamily: "Poppins",
    height: 27,
  },
  bnT: {
    color: "rgba(228, 228, 228, 0.83)",
    width: 267,
  },
  marGroup: {
    top: 3,
    left: 308,
    width: 46,
    position: "absolute",
    height: 21,
  },
  mar3: {
    zIndex: 2,
  },
  mar4: {
    zIndex: 3,
  },
});

// --- Component ---
const Component = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Pressable
      testID="chat-button"
      style={styles_Component.component10}
      onPress={() => navigation.navigate("ChatContent")}
    >
      <View style={styles_Component.image2Wrapper}>
        <View />
      </View>
      <Text style={styles_Component.chat}>Chat</Text>
    </Pressable>
  );
};

const styles_Component = StyleSheet.create({
  component10: {
    height: 50,
    width: 52,
    borderRadius: 90,
  },
  image2Wrapper: {
    width: 40,
    flexDirection: "row",
    paddingLeft: 12,
    height: 28,
  },
  image2Icon: {
    width: 28,
    height: 28,
  },
  chat: {
    width: 55,
    height: 22,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Poppins",
    color: Color.lightLabelPrimary,
    textAlign: "center",
  },
});

// --- Component1 ---
const Component1 = () => {
  return (
    <Pressable style={styles_Component1.component11} onPress={() => {}}>
      <View style={styles_Component1.calendar21075841Wrapper}>
        <View />
      </View>
      <Text style={styles_Component1.sKin}>Sự kiện</Text>
    </Pressable>
  );
};

const styles_Component1 = StyleSheet.create({
  component11: {
    height: 50,
    width: 52,
  },
  calendar21075841Wrapper: {
    width: 40,
    flexDirection: "row",
    paddingLeft: 12,
    height: 28,
  },
  calendar21075841Icon: {
    width: 28,
    height: 28,
  },
  sKin: {
    width: 55,
    height: 22,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Poppins",
    color: Color.lightLabelPrimary,
    textAlign: "center",
  },
});

// --- Component2 ---
const Component2 = () => {
  return (
    <Pressable style={styles_Component2.component12} onPress={() => {}}>
      <View />
      <Text style={styles_Component2.hS}>Hồ sơ</Text>
    </Pressable>
  );
};

const styles_Component2 = StyleSheet.create({
  component12: {
    height: 52,
    width: 53,
    justifyContent: "flex-end",
    paddingHorizontal: 7,
    paddingTop: 30,
  },
  profileIcon: {
    width: "57.74%",
    height: "57.69%",
    position: "absolute",
    top: "0%",
    right: "21.13%",
    bottom: "42.31%",
    left: "21.13%",
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    color: "#37c882",
    zIndex: 0,
  },
  hS: {
    width: 42,
    height: 22,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Poppins",
    color: Color.lightLabelPrimary,
    textAlign: "center",
    zIndex: 1,
  },
});

// --- Component3 ---
const Component3 = () => {
  return (
    <Pressable style={styles_Component3.component9} onPress={() => {}}>
      <View style={styles_Component3.calendar18273191Wrapper}>
        <View />
      </View>
      <View style={styles_Component3.lchWrapper}>
        <Text style={styles_Component3.lch}>Lịch</Text>
      </View>
    </Pressable>
  );
};

const styles_Component3 = StyleSheet.create({
  component9: {
    height: 50,
    width: 40,
  },
  calendar18273191Wrapper: {
    width: 34,
    paddingLeft: 6,
    flexDirection: "row",
    height: 28,
  },
  calendar18273191Icon: {
    width: 28,
    height: 28,
  },
  lchWrapper: {
    alignItems: "center",
    height: 22,
    flexDirection: "row",
    width: 40,
  },
  lch: {
    width: 43,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Poppins",
    color: Color.lightLabelPrimary,
    textAlign: "center",
    height: 22,
  },
});

// --- ContactList ---
const ContactList = () => {
  return (
    <View style={styles_ContactList.contactList}>
      <View style={[styles_ContactList.contactEntry, styles_ContactList.contactLayout1]}>
        <View />
        <View style={[styles_ContactList.contactInfo, styles_ContactList.contactLayout1]}>
          <View style={styles_ContactList.multipleContacts}>
            <View style={[styles_ContactList.contactRowContainer, styles_ContactList.contactLayout]}>
              <View style={[styles_ContactList.contactSubrow, styles_ContactList.contactLayout]}>
                <View />
                <View style={styles_ContactList.contactsInner}>
                  <View />
                  <View />
                </View>
              </View>
            </View>
            <View style={[styles_ContactList.contactRowContainer, styles_ContactList.contactLayout]}>
              <View style={[styles_ContactList.contactSubrow, styles_ContactList.contactLayout]}>
                <View />
                <View style={styles_ContactList.contactsInner}>
                  <View />
                  <View />
                </View>
              </View>
            </View>
            <View style={[styles_ContactList.contactRowContainer, styles_ContactList.contactLayout]}>
              <View style={[styles_ContactList.contactSubrow, styles_ContactList.contactLayout]}>
                <View />
                <View style={styles_ContactList.contactsInner}>
                  <View />
                  <View />
                </View>
              </View>
            </View>
          </View>
          <View
            style={[styles_ContactList.conversationPreviews, styles_ContactList.frameWrapperSpaceBlock]}
          >
            <View style={styles_ContactList.multiplePreviews}>
              <View style={[styles_ContactList.previewColumn, styles_ContactList.previewLayout]}>
                <View style={styles_ContactList.previewDetails}>
                  <View
                    style={[
                      styles_ContactList.messagePreviewContainer,
                      styles_ContactList.messageParentFlexBox,
                    ]}
                  >
                    <Text style={[styles_ContactList.johnWalton, styles_ContactList.johnTypo]}>
                      John Walton
                    </Text>
                    <Text style={[styles_ContactList.johnWalton2, styles_ContactList.johnTypo]}>
                      John Walton
                    </Text>
                  </View>
                  <View
                    style={[
                      styles_ContactList.timestampColumn,
                      styles_ContactList.frameWrapperSpaceBlock,
                    ]}
                  >
                    <View style={[styles_ContactList.timeLabel, styles_ContactList.janGroupLayout]}>
                      <Text style={[styles_ContactList.feb, styles_ContactList.febTypo1]}>08 Feb</Text>
                      <Text style={[styles_ContactList.feb2, styles_ContactList.febTypo1]}>08 Feb</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles_ContactList.messageContent, styles_ContactList.messageParentFlexBox]}
                >
                  <Text style={[styles_ContactList.iamSendingYou, styles_ContactList.letsTypo]}>
                    I’am sending you a parcel rece..
                  </Text>
                  <Text style={[styles_ContactList.iamSendingYou2, styles_ContactList.letsTypo]}>
                    I’am sending you a parcel rece..
                  </Text>
                </View>
              </View>
              <View style={[styles_ContactList.previewColumn2, styles_ContactList.frameLayout]}>
                <View style={[styles_ContactList.frameParent, styles_ContactList.frameLayout]}>
                  <View
                    style={[
                      styles_ContactList.monicaRandawaParent,
                      styles_ContactList.messageParentFlexBox,
                    ]}
                  >
                    <Text style={[styles_ContactList.monicaRandawa, styles_ContactList.monicaTypo]}>
                      Monica Randawa
                    </Text>
                    <Text style={[styles_ContactList.monicaRandawa2, styles_ContactList.monicaTypo]}>
                      Monica Randawa
                    </Text>
                  </View>
                  <View
                    style={[styles_ContactList.frameWrapper, styles_ContactList.frameWrapperSpaceBlock]}
                  >
                    <View style={[styles_ContactList.febParent, styles_ContactList.janGroupLayout]}>
                      <Text style={[styles_ContactList.feb3, styles_ContactList.febTypo]}>02 Feb</Text>
                      <Text style={[styles_ContactList.feb4, styles_ContactList.febTypo]}>02 Feb</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles_ContactList.hopeYoureDoingWellTodayParent,
                    styles_ContactList.messageParentFlexBox,
                  ]}
                >
                  <Text style={[styles_ContactList.hopeYoureDoing, styles_ContactList.hopeTypo]}>
                    Hope you’re doing well today..
                  </Text>
                  <Text style={[styles_ContactList.hopeYoureDoing2, styles_ContactList.hopeTypo]}>
                    Hope you’re doing well today..
                  </Text>
                </View>
              </View>
              <View style={[styles_ContactList.previewColumn2, styles_ContactList.frameLayout]}>
                <View style={[styles_ContactList.frameGroup, styles_ContactList.frameLayout]}>
                  <View
                    style={[
                      styles_ContactList.innoxentJayParent,
                      styles_ContactList.messageParentFlexBox,
                    ]}
                  >
                    <Text
                      style={[styles_ContactList.innoxentJay, styles_ContactList.innoxentTypo]}
                    >{`Innoxent Jay `}</Text>
                    <Text
                      style={[styles_ContactList.innoxentJay2, styles_ContactList.innoxentTypo]}
                    >{`Innoxent Jay `}</Text>
                  </View>
                  <View
                    style={[
                      styles_ContactList.timestampColumn,
                      styles_ContactList.frameWrapperSpaceBlock,
                    ]}
                  >
                    <View style={[styles_ContactList.timeLabel, styles_ContactList.janGroupLayout]}>
                      <Text style={[styles_ContactList.feb, styles_ContactList.febTypo1]}>25 Jan</Text>
                      <Text style={[styles_ContactList.feb2, styles_ContactList.febTypo1]}>25 Jan</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles_ContactList.letsGetBackToTheWorkYoParent,
                    styles_ContactList.letsLayout,
                  ]}
                >
                  <Text style={[styles_ContactList.letsGetBack, styles_ContactList.letsLayout]}>
                    Let’s get back to the work, You..
                  </Text>
                  <Text style={[styles_ContactList.letsGetBack2, styles_ContactList.letsLayout]}>
                    Let’s get back to the work, You..
                  </Text>
                </View>
              </View>
              <View style={[styles_ContactList.contactDetails, styles_ContactList.frameLayout]}>
                <View
                  style={[
                    styles_ContactList.contactNameLabels,
                    styles_ContactList.messageParentFlexBox,
                  ]}
                >
                  <Text style={[styles_ContactList.harrySamit, styles_ContactList.harryTypo]}>
                    Harry Samit
                  </Text>
                  <Text style={[styles_ContactList.harrySamit2, styles_ContactList.harryTypo]}>
                    Harry Samit
                  </Text>
                </View>
                <View
                  style={[
                    styles_ContactList.contactAvailability,
                    styles_ContactList.frameWrapperSpaceBlock,
                  ]}
                >
                  <View style={[styles_ContactList.janGroup, styles_ContactList.janGroupLayout]}>
                    <Text style={[styles_ContactList.jan3, styles_ContactList.febTypo1]}>18 Jan</Text>
                    <Text style={[styles_ContactList.jan4, styles_ContactList.febTypo1]}>18 Jan</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles_ContactList = StyleSheet.create({
  contactLayout1: {
    width: 359,
    flexDirection: "row",
    height: 300,
  },
  iconPosition: {
    left: 4,
    position: "absolute",
    height: 50,
    width: 50,
  },
  contactLayout: {
    height: 58,
    width: 58,
  },
  contactIconsPosition: {
    color: "#c4c4c4",
    left: 0,
    top: 0,
    height: 58,
    width: 58,
    position: "absolute",
  },
  frameWrapperSpaceBlock: {
    paddingTop: 3,
    
  },
  previewLayout: {
    gap: 3,
    height: 54,
  },
  messageParentFlexBox: {
    zIndex: 1,
    flexDirection: "row",
  },
  johnTypo: {
    textAlign: "left",
    color: Color.lightLabelPrimary,
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 18,
    width: 118,
    height: 27,
  },
  janGroupLayout: {
    height: 21,
    zIndex: 1,
  },
  febTypo1: {
    color: "#c5bdbd",
    fontSize: 14,
    height: 21,
    textAlign: "left",
    fontFamily: "Poppins",
    left: 0,
    top: 0,
    position: "absolute",
  },
  letsTypo: {
    color: "#e5e5e5",
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
  },
  frameLayout: {
    width: 281,
    
  },
  monicaTypo: {
    width: 162,
    textAlign: "left",
    color: Color.lightLabelPrimary,
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 18,
    height: 27,
  },
  febTypo: {
    width: 49,
    color: "#c5bdbd",
    fontSize: 14,
    height: 21,
    textAlign: "left",
    fontFamily: "Poppins",
    left: 0,
    top: 0,
    position: "absolute",
  },
  hopeTypo: {
    width: 245,
    color: "#e5e5e5",
    fontSize: 16,
    height: 24,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
  },
  innoxentTypo: {
    width: 119,
    textAlign: "left",
    color: Color.lightLabelPrimary,
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 18,
    height: 27,
  },
  letsLayout: {
    width: 250,
    height: 24,
  },
  harryTypo: {
    width: 111,
    textAlign: "left",
    color: Color.lightLabelPrimary,
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 18,
    height: 27,
  },
  contactList: {
    width: 380,
    justifyContent: "flex-end",
    paddingRight: 21,
    flexDirection: "row",
    height: 300,
    
  },
  contactEntry: {
    zIndex: 2,
  },
  contactAvatarIcon: {
    bottom: -24,
    zIndex: 2,
  },
  contactInfo: {
    gap: 19,
  },
  multipleContacts: {
    height: 238,
    gap: 32,
    width: 58,
    
  },
  contactRowContainer: {
    flexDirection: "row",
    
  },
  contactSubrow: {
    zIndex: 2,
  },
  contactIcons: {
    zIndex: 2,
  },
  contactsInner: {
    left: 0,
    top: 0,
    height: 58,
    width: 58,
    position: "absolute",
  },
  profileIcon: {
    top: 4,
    zIndex: 3,
  },
  profileImageIcon: {
    zIndex: 4,
  },
  conversationPreviews: {
    width: 282,
    height: 300,
  },
  multiplePreviews: {
    height: 297,
    gap: 36,
    width: 282,
    
  },
  previewColumn: {
    width: 282,
    
  },
  previewDetails: {
    gap: 120,
    height: 27,
    width: 282,
    flexDirection: "row",
    
  },
  messagePreviewContainer: {
    width: 115,
    height: 27,
  },
  johnWalton: {
    zIndex: 1,
  },
  johnWalton2: {
    marginLeft: -118,
    zIndex: 2,
  },
  timestampColumn: {
    height: 24,
    width: 47,
  },
  timeLabel: {
    width: 47,
  },
  feb: {
    zIndex: 1,
    width: 50,
    color: "#c5bdbd",
    fontSize: 14,
  },
  feb2: {
    zIndex: 2,
    width: 50,
    color: "#c5bdbd",
    fontSize: 14,
  },
  messageContent: {
    width: 257,
    height: 24,
  },
  iamSendingYou: {
    width: 260,
    fontSize: 16,
    height: 24,
    zIndex: 1,
  },
  iamSendingYou2: {
    marginLeft: -260,
    width: 260,
    fontSize: 16,
    height: 24,
    zIndex: 2,
  },
  previewColumn2: {
    gap: 3,
    height: 54,
  },
  frameParent: {
    gap: 76,
    height: 27,
    flexDirection: "row",
  },
  monicaRandawaParent: {
    width: 159,
    height: 27,
  },
  monicaRandawa: {
    zIndex: 1,
  },
  monicaRandawa2: {
    marginLeft: -162,
    zIndex: 2,
  },
  frameWrapper: {
    width: 46,
    height: 24,
  },
  febParent: {
    width: 46,
  },
  feb3: {
    zIndex: 1,
  },
  feb4: {
    zIndex: 2,
  },
  hopeYoureDoingWellTodayParent: {
    width: 242,
    height: 24,
  },
  hopeYoureDoing: {
    zIndex: 1,
  },
  hopeYoureDoing2: {
    marginLeft: -245,
    zIndex: 2,
  },
  frameGroup: {
    gap: 118,
    height: 27,
    flexDirection: "row",
  },
  innoxentJayParent: {
    width: 116,
    height: 27,
  },
  innoxentJay: {
    zIndex: 1,
  },
  innoxentJay2: {
    marginLeft: -119,
    zIndex: 2,
  },
  letsGetBackToTheWorkYoParent: {
    zIndex: 1,
    flexDirection: "row",
  },
  letsGetBack: {
    color: "#e5e5e5",
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
    zIndex: 1,
  },
  letsGetBack2: {
    marginLeft: -250,
    color: "#e5e5e5",
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
    zIndex: 2,
  },
  contactDetails: {
    gap: 130,
    height: 27,
    flexDirection: "row",
  },
  contactNameLabels: {
    width: 108,
    height: 27,
  },
  harrySamit: {
    zIndex: 1,
  },
  harrySamit2: {
    marginLeft: -111,
    zIndex: 2,
  },
  contactAvailability: {
    width: 43,
    height: 24,
  },
  janGroup: {
    width: 43,
  },
  jan3: {
    width: 46,
    zIndex: 1,
  },
  jan4: {
    width: 46,
    zIndex: 2,
  },
});

// --- GroupComponent ---
const GroupComponent = () => {
  return (
    <View style={styles_GroupComponent.iconsParent}>
      <View style={styles_GroupComponent.icons}>
        <View />
        <View />
        <View />
        <View />
        <View />
      </View>
      <View style={styles_GroupComponent.attach}>
        <View />
      </View>
      <View style={styles_GroupComponent.reactions}>
        <View />
        <View />
        <View />
        <View />
      </View>
    </View>
  );
};

const styles_GroupComponent = StyleSheet.create({
  iconsParent: {
    marginRight: -11,
    width: 387,
    paddingLeft: 20,
    paddingRight: 11,
    gap: 33,
    marginTop: -707,
    zIndex: 1,
    flexDirection: "row",
    height: 70,
  },
  icons: {
    position: "absolute",
    marginTop: -32,
    top: "50%",
    left: 0,
    gap: 16,
    zIndex: 0,
    height: 64,
    flexDirection: "row",
  },
  iconList: {
    width: 64,
    height: 64,
  },
  attach: {
    height: 47,
    paddingTop: 23,
    width: 24,
    zIndex: 1,
  },
  attachmentIcon: {
    height: 24,
    color: Color.greyscaleGrey80,
    width: 24,
    zIndex: 1,
  },
  reactions: {
    width: 299,
    gap: 10,
    zIndex: 1,
    flexDirection: "row",
    height: 70,
  },
  reactionIcons: {
    width: 70,
    color: "#c4c4c4",
    zIndex: 1,
    height: 70,
  },
});

// --- LiquidGlassRegularSmall ---
export type LiquidGlassRegularSmallType = {
  /** Variant props */
  mode?: string;
  state?: string;
};

const LiquidGlassRegularSmall = ({
  mode = "Light",
  state = "Default",
}: LiquidGlassRegularSmallType) => {
  return (
    <View style={[styles_LiquidGlassRegularSmall.liquidGlassRegularSmall, styles_LiquidGlassRegularSmall.fillShadowShadowBox]}>
      <View style={[styles_LiquidGlassRegularSmall.fillShadow, styles_LiquidGlassRegularSmall.fillShadowLayout]} />
      <View style={[styles_LiquidGlassRegularSmall.glassEffect, styles_LiquidGlassRegularSmall.fillShadowLayout]} />
    </View>
  );
};

const styles_LiquidGlassRegularSmall = StyleSheet.create({
  fillShadowShadowBox: {
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    elevation: 40,
    boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
  },
  fillShadowLayout: {
    overflow: "hidden",
    borderRadius: 296,
    width: 352,
    height: 65,
  },
  liquidGlassRegularSmall: {
    flexDirection: "row",
    zIndex: 1,
    borderRadius: 296,
    width: 352,
    height: 65,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    elevation: 40,
    boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
  },
  fillShadow: {
    display: "none",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    elevation: 40,
    boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
  },
  glassEffect: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
});

// --- Navbar ---
export type NavbarType = {
  mode?: string;
  state?: string;
};

const Navbar = ({ mode, state }: NavbarType) => {
  return (
    <View style={styles_Navbar.navbar}>
      <LiquidGlassRegularSmall mode={mode} state={state} />
      <View style={styles_Navbar.actionBar}>
        <View style={styles_Navbar.navActionItems}>
          <View />
          <View />
          <View />
          <View />
        </View>
      </View>
    </View>
  );
};

const styles_Navbar = StyleSheet.create({
  navbar: {
    height: 65,
    width: 352,
    alignItems: "flex-end",
    zIndex: 2,
    flexDirection: "row",
  },
  actionBar: {
    height: 56,
    justifyContent: "flex-end",
    paddingBottom: 4,
    marginLeft: -338,
    width: 325,
    zIndex: 2,
  },
  navActionItems: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    width: 325,
    flexDirection: "row",
  },
});

// --- OutlinerScreen ---
const OutlinerScreen = () => {
  return (
    <View style={[styles_OutlinerScreen.outlinerScreen, styles_OutlinerScreen.homePosition]}>
      <View style={styles_OutlinerScreen.scheduleContainer}>
        <View style={styles_OutlinerScreen.taskHeader}>
          <Text style={[styles_OutlinerScreen.time, styles_OutlinerScreen.homePosition]}>9:41</Text>
        </View>
        <View />
      </View>
      <View style={styles_OutlinerScreen.homeLayout}>
        <View style={[styles_OutlinerScreen.homeIndicator2, styles_OutlinerScreen.homeLayout]}>
          <View style={[styles_OutlinerScreen.homeIndicatorChild, styles_OutlinerScreen.homeLayout]} />
          <View />
        </View>
      </View>
    </View>
  );
};

const styles_OutlinerScreen = StyleSheet.create({
  homePosition: {
    left: 0,
    position: "absolute",
  },
  homeLayout: {
    height: 34,
    width: 402,
  },
  outlinerScreen: {
    height: 874,
    right: 0,
    bottom: 0,
    borderRadius: 62,
    backgroundColor: "#fff",
    overflow: "hidden",
    gap: 768,
    zIndex: 0,
    top: 0,
    left: 0,
  },
  scheduleContainer: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 36,
    paddingRight: 28,
    gap: 20,
    width: 402,
  },
  taskHeader: {
    width: 27,
    height: 21,
  },
  time: {
    marginTop: -10,
    top: "50%",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins",
    color: Color.lightLabelPrimary,
    textAlign: "left",
    width: 30,
    height: 21,
  },
  controlsIcon: {
    height: 13,
    width: 67,
  },
  homeIndicator2: {
    left: 0,
    position: "absolute",
    top: 0,
  },
  homeIndicatorChild: {
    display: "none",
    left: 0,
    position: "absolute",
    top: 0,
  },
  homeIndicatorIcon: {
    top: 15,
    left: 134,
    ...BoxShadow.m3ElevationLight2,
    width: 134,
    height: 5,
    color: Color.greyscaleGrey80,
    position: "absolute",
  },
});

// --- TaskManagement ---
const TaskManagement = () => {
  return (
    <View style={styles_TaskManagement.taskManagement}>
      <View style={[styles_TaskManagement.searchPanel, styles_TaskManagement.searchPanelLayout]}>
        <View />
        <View style={[styles_TaskManagement.upcomingTasks, styles_TaskManagement.searchPanelLayout]}>
          <Text testID="home-title" style={[styles_TaskManagement.nextime, styles_TaskManagement.nextimeFlexBox]}>NexTime</Text>
          <TextInput
            testID="search-input"
            style={[styles_TaskManagement.searchInputContainer, styles_TaskManagement.nextimeFlexBox]}
            placeholder="Search here.."
            multiline={false}
            placeholderTextColor="#babecc"
          />
        </View>
      </View>
    </View>
  );
};

const styles_TaskManagement = StyleSheet.create({
  searchPanelLayout: {
    height: 90,
    width: 354,
  },
  nextimeFlexBox: {
    textAlign: "left",
    zIndex: 1,
  },
  taskManagement: {
    
    width: 378,
    height: 200,
    justifyContent: "flex-end",
    paddingRight: 24,
    paddingBottom: 110,
    flexDirection: "row",
  },
  searchPanel: {
    zIndex: 1,
    flexDirection: "row",
  },
  edit3Icon: {
    height: 25,
    width: 25,
    position: "absolute",
    top: 8,
    right: 0,
    zIndex: 1,
  },
  upcomingTasks: {
    gap: 8,
  },
  nextime: {
    width: 122,
    height: 40,
    fontSize: 26,
    fontWeight: "500",
    fontFamily: "Poppins",
    color: Color.lightLabelPrimary,
  },
  searchInputContainer: {
    height: 42,
    borderRadius: 62,
    backgroundColor: "#fffdfd",
    borderStyle: "solid",
    borderColor: "#9fa3b3",
    borderWidth: 1,
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 354,
    textAlign: "left",
    flexDirection: "row",
  },
});

// --- UtilityBar ---
const UtilityBar = () => {
  return (
    <View style={[styles_UtilityBar.utilityBar, styles_UtilityBar.utilityLayout]}>
      <View style={[styles_UtilityBar.utilityComponents, styles_UtilityBar.utilityLayout]}>
        <View style={[styles_UtilityBar.floatingBar, styles_UtilityBar.sendButtonLayout]}>
          <View />
          <Text style={[styles_UtilityBar.hiDavidHope, styles_UtilityBar.hiDavidHopeTypo]}>
            Hi, David. Hope you’re doing....
          </Text>
          <View style={[styles_UtilityBar.sendButton, styles_UtilityBar.sendButtonLayout]} />
          <View style={styles_UtilityBar.navBarContainer}>
            <Navbar mode="Light" state="Default" />
            <View style={styles_UtilityBar.name}>
              <Text style={[styles_UtilityBar.jonnasAutron, styles_UtilityBar.hiDavidHopeTypo]}>
                Jonnas Autron
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles_UtilityBar.problem}>
        <Text style={[styles_UtilityBar.listenDavidI, styles_UtilityBar.listenTypo]}>
          Listen david, i have a problem..
        </Text>
        <Text style={[styles_UtilityBar.listenDavidI2, styles_UtilityBar.listenTypo]}>
          Listen david, i have a problem..
        </Text>
      </View>
    </View>
  );
};

const styles_UtilityBar = StyleSheet.create({
  utilityLayout: {
    height: 132,
    width: 402,
  },
  sendButtonLayout: {
    height: 120,
    width: 402,
  },
  hiDavidHopeTypo: {
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
    zIndex: 1,
  },
  listenTypo: {
    color: "#e4e4e4",
    width: 252,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 16,
    height: 24,
  },
  utilityBar: {
    
    flexDirection: "row",
  },
  utilityComponents: {
    zIndex: 3,
    paddingTop: 12,
  },
  floatingBar: {
    paddingHorizontal: 25,
    paddingTop: 27,
    paddingBottom: 28,
    zIndex: 3,
  },
  composeIcon: {
    width: 52,
    height: 52,
    bottom: 26,
    left: 22,
    zIndex: 1,
    position: "absolute",
  },
  hiDavidHope: {
    width: 244,
    right: 64,
    bottom: 21,
    color: "#9c9797",
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Poppins",
    fontWeight: "500",
    height: 24,
    position: "absolute",
  },
  sendButton: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 62,
    backgroundColor: "rgba(240, 242, 245, 0.35)",
    position: "absolute",
  },
  navBarContainer: {
    width: 352,
    height: 65,
    flexDirection: "row",
  },
  name: {
    width: 133,
    height: 45,
    paddingTop: 18,
    marginLeft: -283,
  },
  jonnasAutron: {
    width: 136,
    height: 27,
    fontSize: 18,
    color: Color.lightLabelPrimary,
  },
  problem: {
    width: 249,
    zIndex: 1,
    marginLeft: -303,
    height: 24,
    flexDirection: "row",
  },
  listenDavidI: {
    zIndex: 1,
  },
  listenDavidI2: {
    zIndex: 2,
    marginLeft: -252,
  },
});


const MainChatScreen = ({ onBack }: { onBack?: () => void }) => {
  return (
    <KeyboardAwareScrollView
      style={styles.mainChatScreen}
      contentContainerStyle={styles.mainChatScreenContent}
    >
      <Text style={styles.text}>2</Text>
      <View style={styles.interface}>
        <OutlinerScreen />
        <TaskManagement />
        <ChatContent />
        <ContactList />
        <UtilityBar />
      </View>
      <GroupComponent />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  mainChatScreenContent: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    height: 874,
    flex: 1,
  },
  mainLayout: {
    height: 50,
    width: 50,
    display: "none",
  },
  mainChatScreen: {
    width: "100%",
    flex: 1,
    maxWidth: "100%",
  },
  mainChatScreenChild: {
    zIndex: 1,
    display: "none",
  },
  mainChatScreenItem: {
    zIndex: 2,
    display: "none",
  },
  mainChatScreenInner: {
    zIndex: 3,
    display: "none",
  },
  ellipseIcon: {
    zIndex: 4,
    display: "none",
  },
  mainChatScreenChild2: {
    width: 14,
    height: 14,
    color: "#55a99d",
    zIndex: 5,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Poppins",
    color: "#fff",
    textAlign: "left",
    zIndex: 6,
    display: "none",
  },
  mainChatScreenChild3: {
    width: 52,
    height: 26,
    position: "absolute",
    marginLeft: -26,
    bottom: -77,
    left: "50%",
  },
  interface: {
    width: 402,
    height: 874,
    alignItems: "flex-end",
    paddingTop: 56,
    paddingBottom: 4,
    gap: 3,
    marginTop: -707,
  },
});

export default MainChatScreen;
