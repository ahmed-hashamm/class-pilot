"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/* ---------------- TYPES ---------------- */
export interface Note {
  id: string
  content: string
  created_at: string
}

/* ---------------- GET NOTES ---------------- */
export async function getStickyNotes(classId: string): Promise<Note[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("class_notes")
    .select("id, content, created_at")
    .eq("class_id", classId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data ?? []
}

/* ---------------- ADD NOTE ---------------- */
export async function addStickyNote(classId: string, content: string) {
  if (!content.trim()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("class_notes").insert({
    class_id: classId,
    user_id: user.id,
    content,
  } as any)
}

/* ---------------- CLEAR NOTES ---------------- */
export async function clearStickyNotes(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("class_notes")
    .delete()
    .eq("class_id", classId)
    .eq("user_id", user.id)
}
// export async function createAnnouncement(formData: FormData) {
//   const supabase = await createClient()

//   // Get the user from the current session instead of props
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) throw new Error("You must be logged in to post")
//   const userId = user.id // Use this ID instead of the one from formData

//   const content = formData.get('content') as string
//   const classId = formData.get('classId') as string
//   const file = formData.get('file') as File | null

//   if (!classId || classId === 'undefined') throw new Error("Missing Class ID")
//   if (!userId || userId === 'undefined') throw new Error("Missing User ID")
//   let filePath = null
// // VALIDATION: This prevents the "undefined" UUID error
// if (!classId || classId === 'undefined') throw new Error("Missing Class ID");
// if (!userId || userId === 'undefined') throw new Error("Missing User ID");
//   // 1. Upload file if exists
//   if (file && file.size > 0) {
//     const fileName = `${Math.random()}-${Date.now()}.${file.name.split('.').pop()}`
//     const { data, error: uploadError } = await supabase.storage
//       .from('announcements-files')
//       .upload(`${classId}/${fileName}`, file)

//     if (uploadError) throw new Error("Upload failed: " + uploadError.message)
//     filePath = data.path
//   }

//   // 2. Insert into DB
//   // ADJUST THESE COLUMN NAMES TO MATCH YOUR TABLE EXACTLY
//   const { error: dbError } = await supabase
//     .from('announcements')
//     .insert({
//       content: content,
//       class_id: classId,      // Make sure column is called class_id
//       created_by: userId,    // Make sure column is called created_by
//       attachment_path: filePath, // Make sure column is called attachment_path
//       title: 'Class Update',  // If your table requires a title
//     } as any)

//   if (dbError) {
//     console.error("DB Error:", dbError)
//     throw new Error(`Database insert failed: ${dbError.message}`)
//   }

//   revalidatePath('/') 
//   return { success: true }
// }

// export async function createAnnouncement(formData: FormData) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) throw new Error("Unauthorized")

//   const title = formData.get('title') as string
//   const content = formData.get('content') as string
//   const classId = formData.get('classId') as string
//   const pinned = formData.get('pinned') === 'true'
//   const deadline = formData.get('deadline') as string | null
//   
//   // Get all files from the 'files' field (ensure your input has name="files")
//   const files = formData.getAll('files') as File[]
//   const attachmentPaths: string[] = []

//   // Loop through and upload each file
//  // inside createAnnouncement in actions.ts

// // inside createAnnouncement in actions.ts

// for (const file of files) {
//   if (file.size > 0) {
//     // We use a timestamp + original name to ensure uniqueness 
//     // but keep the original name readable
//     const safeName = file.name.replace(/[^a-z0-9.]/gi, '_'); // Optional: clean special chars
//     const fileName = `${Date.now()}-${safeName}`; 
//     
//     const { data, error: uploadError } = await supabase.storage
//       .from('announcements-files')
//       .upload(`${classId}/${fileName}`, file)

//     if (uploadError) throw new Error("Upload failed: " + uploadError.message)
//     attachmentPaths.push(data.path)
//   }
// }

//   const { error: dbError } = await supabase
//     .from('announcements')
//     .insert({
//       title: title || 'Class Update',
//       content: content,
//       class_id: classId,
//       created_by: user.id,
//       attachment_paths: attachmentPaths, // Store the array
//       pinned: pinned,
//       deadline: deadline || null
//     } as any)

//   if (dbError) throw new Error(`Database insert failed: ${dbError.message}`)

//   revalidatePath(`/classes/${classId}`) 
//   return { success: true }
// } 
/* ---------------- HELPER: UPLOAD FILES ---------------- */
/**
 * Internal helper to handle multiple file uploads to a specific bucket
 */
async function uploadFiles(files: File[], classId: string, bucket: string) {
  const supabase = await createClient()
  const paths: string[] = []

  for (const file of files) {
    if (file.size > 0) {
      // Clean filename: remove special chars but keep the name readable
      const safeName = file.name.replace(/[^a-z0-9.]/gi, '_');
      const fileName = `${Date.now()}-${safeName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(`${classId}/${fileName}`, file)

      if (uploadError) throw new Error(`Upload to ${bucket} failed: ${uploadError.message}`)
      paths.push(data.path)
    }
  }
  return paths
}

/* ---------------- CREATE ANNOUNCEMENT ---------------- */
export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const classId = formData.get('classId') as string
  const files = formData.getAll('files') as File[]

  const attachmentPaths = await uploadFiles(files, classId, 'announcements-files')

  const { error: dbError } = await supabase
    .from('announcements')
    .insert({
      title: formData.get('title') || 'Class Update',
      content: formData.get('content'),
      class_id: classId,
      created_by: user.id,
      attachment_paths: attachmentPaths,
      pinned: formData.get('pinned') === 'true',
      deadline: formData.get('deadline') || null
    } as any)

  if (dbError) throw new Error(`Announcement failed: ${dbError.message}`)

  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true }
}

/* ---------------- CREATE MATERIAL ---------------- */
// export async function createMaterial(formData: FormData) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) throw new Error("Unauthorized")

//   const classId = formData.get('classId') as string
//   const files = formData.getAll('files') as File[]

//   // Logic matches announcement, using 'materials' bucket
//   const attachmentPaths = await uploadFiles(files, classId, 'materials')

//   const { error: dbError } = await supabase
//     .from('materials')
//     .insert({
//       title: formData.get('title') || 'Class Material',
//       description: formData.get('description'),
//       class_id: classId,
//       created_by: user.id,
//       attachment_paths: attachmentPaths,
//     } as any)

//   if (dbError) throw dbError

//   revalidatePath(`/dashboard/classes/${classId}`)
//   return { success: true }
// }



const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

export async function createMaterial(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const classId = formData.get('classId') as string
  if (!classId) throw new Error('Missing classId')

  const files = formData.getAll('files') as File[]
  if (!files.length) throw new Error('No files provided')

  // 🔹 Extract & validate file types
  const fileTypes = files.map((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_FILE_TYPES.includes(ext)) {
      throw new Error(`Unsupported file type: ${file.name}`)
    }
    return ext
  })

  // 🔹 Upload files (existing logic)
  const attachmentPaths = await uploadFiles(files, classId, 'materials')

  // 🔹 Insert into DB
  const { error } = await supabase.from('materials').insert({
    title: formData.get('title') || 'Class Material',
    description: formData.get('description'),
    class_id: classId,
    created_by: user.id,
    attachment_paths: attachmentPaths,
    file_types: fileTypes, // ✅ NEW
  } as any)

  if (error) throw error

  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true }
}


/* ---------------- CREATE ASSIGNMENT ---------------- */
// export async function createAssignment(formData: FormData) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) throw new Error("Unauthorized")

//   const classId = formData.get('classId') as string
//   const files = formData.getAll('files') as File[]

//   // Logic matches announcement, using 'assignments' bucket
//   const attachmentPaths = await uploadFiles(files, classId, 'assignments')

//   const { error: dbError } = await supabase
//     .from('assignments')
//     .insert({
//       title: formData.get('title'),
//       description: formData.get('description'),
//       due_date: formData.get('due_date'),
//       points: parseInt(formData.get('points') as string) || 100,
//       class_id: classId,
//       created_by: user.id,
//       attachment_paths: attachmentPaths, // Using the same array logic
//     } as any)

//   if (dbError) throw dbError

//   revalidatePath(`/dashboard/classes/${classId}`)
//   return { success: true }
// }

/* ---------------- CREATE ASSIGNMENT ---------------- */
export async function createAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const classId = formData.get('classId') as string
  const files = formData.getAll('files') as File[]

  // Custom helper for uploads (reusing your existing logic)
  const attachmentPaths = await uploadFiles(files, classId, 'assignments')

  const { data, error: dbError } = await supabase
    .from('assignments')
    .insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      due_date: formData.get('dueDate') as string || null,
      points: parseFloat(formData.get('points') as string) || 0,
      class_id: classId,
      created_by: user.id,
      submission_type: formData.get('submissionType') as string || 'file',
      attachment_paths: attachmentPaths,
      is_group_project: formData.get('isGroupProject') === 'true',
    } as any)
    .select()
    .single()

  if (dbError) throw dbError

  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true, id: (data as any).id }
}
//* ---------------- Submit Assignment ---------------- */
interface SubmitAssignmentProps {
  assignmentId: string;
  userId: string;
  groupId?: string | null; // Optional for individual projects
  content?: string;
  files?: any[];
  isGroupProject: boolean;
}

export async function submitAssignment({
  assignmentId,
  userId,
  groupId,
  content,
  files,
  isGroupProject
}: SubmitAssignmentProps) {
  const supabase = await createClient();

  // 1. Prepare the data object for insertion
  const submissionData: any = {
    assignment_id: assignmentId,
    content: content,
    files: files,
    status: 'submitted', // Default status
    submitted_at: new Date().toISOString(),
  };

  // 2. Determine ownership based on project type
  if (isGroupProject && groupId) {
    submissionData.group_id = groupId;
    // We still record the userId of the person who actually uploaded it for history
    submissionData.user_id = userId;
  } else {
    submissionData.user_id = userId;
    submissionData.group_id = null; // Explicitly null for individual projects
  }

  // 3. Use upsert to allow students to update their submission
  // Note: Ensure your DB has a unique constraint on (assignment_id, user_id) 
  // OR (assignment_id, group_id) to prevent duplicate rows.
  const { data, error } = await supabase
    .from('submissions')
    .upsert(submissionData, {
      onConflict: isGroupProject ? 'assignment_id,group_id' : 'assignment_id,user_id'
    })
    .select()
    .single();

  if (error) {
    console.error("Submission Error:", error);
    throw new Error(error.message);
  }

  // 4. Refresh the page data
  revalidatePath('/todo');
  return data;
}


export async function saveGroup(
  classId: string, 
  title: string, 
  groupId?: string | null,
  studentIds: string[] = []
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  let projectId: string;

  // We cast as 'any' here to stop the 'never' type error caused by the 
  // generated Database structure mismatch.
  const projectTable = supabase.from('group_projects') as any;

  if (groupId) {
    const { error } = await projectTable
      .update({ title })
      .eq('id', groupId);
    
    if (error) throw error;
    projectId = groupId;
  } else {
    const { data, error } = await projectTable
      .insert({
        title,
        class_id: classId,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (error) throw error;
    projectId = data.id;
  }

  // Handle Project Members
  if (projectId && studentIds.length > 0) {
    const membersTable = supabase.from('project_members') as any;

    // Clean up existing members if updating
    if (groupId) {
      await membersTable.delete().eq('project_id', projectId);
    }

    const inserts = studentIds.map(uId => ({
      project_id: projectId,
      user_id: uId,
      role: 'member'
    }));

    const { error: memError } = await membersTable.insert(inserts);
    if (memError) throw memError;
  }

  revalidatePath(`/dashboard/classes/${classId}`);
  return { success: true };
}
/* ---------------- REMOVE MEMBER ---------------- */
export async function removeGroupMember(
  projectId: string,
  studentId: string,
  classId: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', studentId)

  if (error) throw error
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- DELETE GROUP ---------------- */
export async function deleteGroup(groupId: string, classId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('group_projects')
    .delete()
    .eq('id', groupId)

  if (error) throw error
  revalidatePath(`/dashboard/classes/${classId}`)
}
export async function getClassName(classId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('classes' as any)
    .select('name')
    .eq('id', classId)
    .single()

  if (error) return 'Class'

  return (data as any).name || 'Class'
}
