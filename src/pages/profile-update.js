import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile, updateProfile } from '../../services/api';
import Image from 'next/image';

export default function ProfileUpdate() {
    const [formData, setFormData] = useState({
        name: '',
        contact_address: '',
        age: '',
        bio: '',
        profile_image: null, // 画像ファイルを格納するフィールド
    });
    const [previewImage, setPreviewImage] = useState(''); // プレビュー用の画像URL
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getProfile();
                setFormData({
                    name: userData.name || '',
                    contact_address: userData.contact_address || '',
                    age: userData.age || '',
                    bio: userData.bio || '',
                    profile_image: userData.profile_image || null, // 画像URLをセット
                });
                setPreviewImage(userData.profile_image); // プレビュー用画像をセット
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, profile_image: file });

        // 画像プレビュー用にFileReaderを使ってURLを取得
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result); // 画像のプレビューを更新
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const form = new FormData();
        form.append('name', formData.name);
        form.append('contact_address', formData.contact_address);
        form.append('age', formData.age);
        form.append('bio', formData.bio);
        if (formData.profile_image) {
            form.append('profile_image', formData.profile_image); // プロフィール画像を追加
        }

        try {
            await updateProfile(form); // API でプロフィールを更新
            setMessage('Profile updated successfully.');
            router.push('/profile'); // 更新後にプロフィールページへリダイレクト
        } catch (error) {
            console.error('Profile Update Error:', error);
            setMessage('Failed to update profile. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="content" style={{ marginTop: '100px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center card-box">
                            <form onSubmit={handleSubmit} className="member-card pt-2 pb-2">
                                <h1>Edit Profile</h1>
                                <div className="thumb-lg member-thumb mx-auto">
                                    {/* 画像のプレビューを表示 */}
                                    <img 
                                        src={previewImage || "assets/images/faces/face15.jpg"} 
                                        className="rounded-circle img-thumbnail" 
                                        alt="profile-image" 
                                        width={240} 
                                        style={{ aspectRatio: '1/1'}}
                                    />
                                </div>
                                <div className="form-group pt-5">
                                    <input
                                        type="file"
                                        name="profile_image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="form-control"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        required
                                        className="form-control"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="contact_address"
                                        value={formData.contact_address}
                                        onChange={handleChange}
                                        placeholder="Contact Address"
                                        required
                                        className="form-control"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        required
                                        className="form-control"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Bio"
                                        className="form-control"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                {loading ?
                                    <button className="btn btn-danger mt-3 waves-effect w-md waves-light" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '5px' }}>Loading...</button>
                                :
                                    <button type="submit" className="btn btn-danger mt-3 waves-effect w-md waves-light" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '5px' }}>Update Profile</button>
                                }
                                {message && <p className="alert alert-info">{message}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}