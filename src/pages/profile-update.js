import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile, updateProfile } from '../../services/api';
import Image from 'next/image';
import { supabase } from '../../supabaseClient';
import styles from '../styles/ProfileUpdate.module.css'; // CSSファイルをインポート

export default function ProfileUpdate() {
    const [formData, setFormData] = useState({
        name: '',
        contact_address: '',
        age: '',
        bio: '',
        profile_image: '',
    });
    const [previewImage, setPreviewImage] = useState('');
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
                    profile_image: userData.profile_image || '',
                });
                setPreviewImage(userData.profile_image);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const isValidInput = (input) => {
        const forbiddenPatterns = [/--/, /;/, /'/, /"/, /\*/, /\bOR\b/i, /\bAND\b/i, /\bUNION\b/i, /\bSELECT\b/i, /\bINSERT\b/i, /\bDELETE\b/i, /\bUPDATE\b/i, /\bDROP\b/i];
        return !forbiddenPatterns.some(pattern => pattern.test(input));
    };

    const handleChange = (e) => {
        if (!isValidInput(e.target.value)) {
            setMessage('Invalid input detected.');
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(formData.name)) {
            setMessage('Name can only contain letters and spaces.');
            return;
        }

        if (!isValidInput(formData.contact_address) || !isValidInput(formData.bio)) {
            setMessage('Invalid input detected.');
            return;
        }

        const age = parseInt(formData.age, 10);
        if (isNaN(age) || age <= 0 || age > 120) {
            setMessage('Please enter a valid age.');
            return;
        }

        setLoading(true);

        const updatedData = {
            name: formData.name,
            contact_address: formData.contact_address,
            age: formData.age,
            bio: formData.bio,
            profile_image: formData.profile_image,
        };

        try {
            await updateProfile(updatedData);
            setMessage('Profile updated successfully.');
            router.push('/profile');
        } catch (error) {
            console.error('Profile Update Error:', error);
            setMessage('Failed to update profile. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className={`content ${styles['content-margin-top']}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center card-box">
                            <form onSubmit={handleSubmit} className="member-card pt-2 pb-2">
                                <h1>Edit Profile</h1>
                                <div className="thumb-lg member-thumb mx-auto">
                                    <Image
                                        src={previewImage || "/assets/images/faces/face15.jpg"}
                                        className={`rounded-circle img-thumbnail ${styles['profile-image']}`}
                                        alt="profile-image"
                                        width={240}
                                        height={240}
                                    />
                                </div>
                                <div className="form-group pt-5">
                                    <input
                                        type="file"
                                        name="profile_image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className={`form-control ${styles['input-white']}`}
                                    />
                                </div>
                                <div className="form-group pt-2">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        required
                                        className={`form-control ${styles['input-white']}`}
                                        maxLength="50"
                                    />
                                </div>
                                <div className="form-group pt-2">
                                    <input
                                        type="text"
                                        name="contact_address"
                                        value={formData.contact_address}
                                        onChange={handleChange}
                                        placeholder="Instagram"
                                        required
                                        className={`form-control ${styles['input-white']}`}
                                        maxLength="50"
                                    />
                                </div>
                                <div className="form-group pt-2">
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        required
                                        className={`form-control ${styles['input-white']}`}
                                        maxLength="5"
                                    />
                                </div>
                                <div className="form-group pt-2">
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Bio"
                                        className={`form-control ${styles['input-white']}`}
                                        maxLength="250"
                                    />
                                </div>
                                {loading ?
                                    <button className={`btn btn-danger mt-4 waves-effect w-md waves-light ${styles['btn-large']}`}>Loading...</button>
                                    :
                                    <button type="submit" className={`btn btn-danger mt-4 waves-effect w-md waves-light ${styles['btn-large']}`}>Update Profile</button>
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