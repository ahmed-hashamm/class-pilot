import StreamView from "./ContentTabs/StreamView";
import MembersTab from "./ContentTabs/MembersTab";
import AssignmentsTab from "./ContentTabs/AssignmentsTab";
import MaterialsTab from "./ContentTabs/MaterialsTab";
import GroupsTab from "./ContentTabs/GroupsTab";

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
        <GroupsTab key={classId} classId={classId} 
        isTeacher={isTeacher} />
      );

    case "materials":
      return (
        <MaterialsTab key={classId} classId={classId} isTeacher={isTeacher} userId={userId} />
      );

    default:
      return null;
  }
}
