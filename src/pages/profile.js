import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProfile } from '../../services/api';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Profile.module.css'; // CSSファイルをインポート

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile();
                setProfile(profileData);
                setLoading(false);
            } catch (error) {
                setError('Failed to load profile. Please try again.');
                setLoading(false);
            }
        };

        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
        } else {
            fetchProfile();
        }
    }, [router]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleEdit = () => {
        router.push('/profile-update');
    };

    return (
        <div className={`content ${styles['content-margin-top']}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center card-box">
                            <div className="member-card pt-2 pb-2">
                                {profile ? (
                                    <>
                                        <div className="thumb-lg member-thumb mx-auto">
                                            <Image 
                                                src={profile.profile_image || "assets/images/faces/face15.jpg"} 
                                                className={`${styles['profile-image']}`} 
                                                alt="profile-image"
                                                width={240}
                                                height={240}
                                            />
                                        </div>
                                        <h1 className="py-3">{profile.name}</h1>
                                        <p className={`${styles['text-white-large']}`}>Age: {profile.age}</p>
                                        <p className={`${styles['text-white-large']} ${styles['mt-negative']}`}>Sex: {profile.sex}</p>
                                        <p className={`${styles['text-white-large']} ${styles['mt-negative']}`}>Instagram: {profile.contact_address}</p>
                                        <p className={`${styles['text-white-large']} ${styles['mt-negative']}`}>Bio: {profile.bio}</p>
                                        <button type="button" className={`btn btn-danger mt-3 waves-effect w-md waves-light ${styles['btn-large']}`} onClick={handleEdit}>Edit Profile</button>
                                    </>
                                ) : (
                                    <p>No profile data found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}