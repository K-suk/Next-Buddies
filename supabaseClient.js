import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export const uploadProfileImage = async (file) => {
//     try {
//         // Supabaseにファイルをアップロード
//         const { data, error } = await supabase.storage
//             .from('ubc-buddies-profile-images')  // バケット名が 'profile-images' と仮定
//             .upload(`public/${file.name}`, file, {
//                 cacheControl: '3600',
//                 upsert: true,  // 同名のファイルが存在する場合は上書き
//             });

//         if (error) {
//             throw error;  // エラーがあればスロー
//         }

//         return data;  // 成功した場合はデータを返す
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         return null;
//     }
// };