const fs = require('fs');
const path = require('path');

const utilsPath = path.join(__dirname, 'src/lib/utils.ts');
let utilsCode = fs.readFileSync(utilsPath, 'utf8');

if (!utilsCode.includes('safeDate')) {
  utilsCode += `
/**
 * Safely parses dates, especially fixing iOS Safari "Invalid Date" 
 * for "YYYY-MM-DD HH:mm:ss" formats by replacing space with "T".
 */
export function safeDate(dateValue: string | Date | null | undefined): Date {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) return dateValue;
  const safeString = typeof dateValue === 'string' ? dateValue.replace(' ', 'T') : String(dateValue);
  return new Date(safeString);
}
`;
  fs.writeFileSync(utilsPath, utilsCode);
}

const targetFiles = [
  "src/components/features/todo/TodoItem.tsx",
  "src/components/features/todo/TeacherTodoItem.tsx",
  "src/components/features/submissions/SubmissionItem.tsx",
  "src/components/features/submissions/SubmissionForm.tsx",
  "src/components/features/materials/MaterialRow/MaterialHeader.tsx",
  "src/components/features/materials/MaterialRow/MaterialRow.tsx",
  "src/components/features/grading/SubmissionContent.tsx",
  "src/components/features/feed/PollInput.tsx",
  "src/components/features/feed/FeedCard.tsx",
  "src/components/features/feed/AttendanceInput.tsx",
  "src/components/features/feed/AnnouncementInput.tsx",
  "src/components/features/dashboard/CalenderView.tsx", // specific line
  "src/components/features/dashboard/ClassCard/ClassCardAssignments.tsx",
  "src/components/features/discussions/DiscussionMessage.tsx",
  "src/components/features/classes/contentTabs/ProjectsTab.tsx",
  "src/components/features/classes/sidebar/StickyNotes.tsx",
  "src/components/features/classes/sidebar/DueSoonCard.tsx",
  "src/components/features/assignments/AssignmentsList.tsx",
  "src/components/features/assignments/AssignmentDetail/AssignmentDetailInfo.tsx",
  "src/components/features/assignments/AssignmentCard/AssignmentHeader.tsx",
  "src/components/features/assignments/AssignmentCard/AssignmentFooter.tsx",
  "src/components/features/assignments/AssignmentDetail/AssignmentDetailHeader.tsx",
  "src/components/features/assignments/AssignmentDetail/AssignmentDetail.tsx",
  "src/components/features/assignments/AssignmentCard/AssignmentCard.tsx"
];

for (const file of targetFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let code = fs.readFileSync(filePath, 'utf8');
  let originalCode = code;

  // We only want to replace new Date(something) if something is not empty and doesn't contain a comma (to avoid new Date(y, m, d))
  // Also we must add import { safeDate } from "@/lib/utils" if we replace something

  let replaced = false;
  
  // Replace new Date(variable) -> safeDate(variable)
  // Exclude new Date()
  code = code.replace(/new Date\(([^),]+)\)/g, (match, group1) => {
    // If it's `new Date().toISOString()` or similar, group1 is empty string, but our regex `[^),]+` requires at least 1 char.
    // If it's a number like `new Date(1234)`, it's safe, but `safeDate` handles it.
    // However, what if group1 is `.getTime()` etc? wait, `new Date().getTime()` won't match `[^),]+` correctly? No, it will match nothing inside `()` because `()` is empty.
    
    // Ignore `new Date()`
    if (group1.trim() === '') return match;
    
    replaced = true;
    return `safeDate(${group1})`;
  });

  if (replaced) {
    if (!code.includes("import { safeDate }")) {
      // Find the last import statement or the beginning of the file
      const importMatches = [...code.matchAll(/^import /gm)];
      if (importMatches.length > 0) {
        // Just insert it after the first import for simplicity
        code = code.replace(/^(import .*)$/m, `$1\nimport { safeDate } from "@/lib/utils";`);
      } else {
        code = `import { safeDate } from "@/lib/utils";\n${code}`;
      }
    }
    fs.writeFileSync(filePath, code);
    console.log(`Updated ${file}`);
  }
}
