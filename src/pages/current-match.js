import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentMatch, submitReview } from '../../services/api';
import ReviewModal from '../../components/ReviewModal';
import Image from 'next/image';
import '../styles/CurrentMatch.css';  // CSSファイルをインポート

export default function CurrentMatch() {
    const [match, setMatch] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const data = await getCurrentMatch();
                setMatch(data);
                if (data.review_count && data.review_sum) {
                    setAverageRating(data.review_sum / data.review_count);
                }
            } catch (error) {
                console.error('Error fetching current match:', error);
                router.push('/home');
            }
        };

        fetchMatchData();
    }, [router]);

    const handleDoneClick = () => {
        setLoading(true);
        setIsReviewModalOpen(true);
        setLoading(false);
    };

    const handleReviewSubmit = async (review) => {
        try {
            const updatedRating = await submitReview(review);
            setAverageRating(updatedRating);
            setIsReviewModalOpen(false);
            router.push('/home');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const supabaseBaseUrl = 'https://rfljgrsesttopohfkikg.supabase.co/storage/v1/object/public/ubc-buddies-profile-images/public/';

    return (
        <div className="content content-margin-top">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center card-box">
                            <div className="member-card">
                                <h1>Matching Information</h1>
                                {match ? (
                                    <>
                                        <div className="thumb-lg member-thumb mx-auto">
                                            <Image
                                                src={match && match.profile_image 
                                                    ? `${supabaseBaseUrl}${match.profile_image.split('/').pop()}`
                                                    : "assets/images/faces/face15.jpg"}
                                                className="rounded-circle img-thumbnail profile-image"
                                                alt="profile-image"
                                                width={240}
                                                height={240}
                                            />
                                        </div>
                                        <h1 className='mt-3'>{match.name}</h1>
                                        <p className="text-white-large">Age: {match.age}</p>
                                        <p className="text-white-large mt-negative">Sex: {match.sex}</p>
                                        <p className="text-white-large mt-negative">Instagram: {match.contact_address}</p>
                                        <p className="text-white-large mt-negative">Bio: {match.bio}</p>
                                        {loading ?
                                            <button type="button" className="btn btn-danger mt-3 waves-effect w-md waves-light btn-large">Loading...</button>
                                        :
                                            <button type="button" className="btn btn-danger mt-3 waves-effect w-md waves-light btn-large" onClick={handleDoneClick}>Done</button>
                                        }
                                    </>
                                ) : (
                                    <p>No profile data found.</p>
                                )}
                                <ReviewModal
                                    isOpen={isReviewModalOpen}
                                    onRequestClose={() => setIsReviewModalOpen(false)}
                                    onReviewSubmit={handleReviewSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}