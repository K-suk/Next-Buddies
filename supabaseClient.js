import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseのURLとAnonキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// プロフィール画像をSupabaseにアップロードする関数
export const uploadProfileImage = async (file) => {
    try {
        // Supabaseにファイルをアップロード
        const { data, error } = await supabase.storage
            .from('profile-images')  // バケット名が 'profile-images' と仮定
            .upload(`public/${file.name}`, file, {
                cacheControl: '3600',
                upsert: true,  // 同名のファイルが存在する場合は上書き
            });

        if (error) {
            throw error;  // エラーがあればスロー
        }

        return data;  // 成功した場合はデータを返す
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};