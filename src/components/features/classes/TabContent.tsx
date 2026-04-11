import StreamView from "./contentTabs/StreamView";
import MembersTab from "./contentTabs/MembersTab";
import AssignmentsTab from "./contentTabs/AssignmentsTab";
import MaterialsTab from "./contentTabs/MaterialsTab";
import GroupsTab from "./contentTabs/GroupsTab";

/**
 * Main feature dispatcher for the classroom.
 * 
 * Based on the `activeTab` prop, it renders the corresponding view:
 * - "stream": Real-time announcements and discussion
 * - "work": Assignment management and lists
 * - "materials": Document and file resource tab
 * - "people": Student and Teacher rosters
 * - "groups": Team/Student grouping logic
 */
export default function TabContent({
  activeTab,
  classId,
  isTeacher,
  classCode,
  userId,
  classSettings,
}: any) {
  switch (activeTab) {
    case "stream":
      return (
        <StreamView
          key={classId}
          classId={classId}
          classCode={classCode}
          isTeacher={isTeacher}
          userId={userId}
          settings={{ showClassCode: classSettings.showClassCode }}
        />
      );

    case "people":
      return (
        <MembersTab key={classId} classId={classId} isTeacher={isTeacher} userId={userId} />
      );

    case "work":
      return (
        <AssignmentsTab
          key={classId}
          classId={classId}
          isTeacher={isTeacher}
          userId={userId}
        />
      );

    case "groups":
      return (
        <GroupsTab 
          key={classId} 
          classId={classId} 
          isTeacher={isTeacher}
          userId={userId}
        />
      );

    case "materials":
      return (
        <MaterialsTab 
          key={classId} 
          classId={classId} 
          isTeacher={isTeacher} 
          userId={userId}
        />
      );

    default:
      return null;
  }
}
