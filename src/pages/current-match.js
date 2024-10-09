import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentMatch, submitReview } from '../../services/api';
import ReviewModal from '../../components/ReviewModal'; // モーダルコンポーネントをインポート
import Image from 'next/image';

export default function CurrentMatch() {
    const [match, setMatch] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(false); // Loading状態を追加
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
                router.push('/home'); // マッチがない場合、ホームにリダイレクト
            }
        };

        fetchMatchData();
    }, [router]);

    const handleDoneClick = () => {
        setLoading(true);
        setIsReviewModalOpen(true); // モーダルを開く
        setLoading(false);
    };

    const handleReviewSubmit = async (review) => {
        try {
            const updatedRating = await submitReview(review);
            setAverageRating(updatedRating);
            setIsReviewModalOpen(false);
            router.push('/home'); // レビュー送信後にホームページにリダイレクト
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className="content" style={{ marginTop: '100px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center card-box">
                            <div className="member-card pt-2 pb-2">
                                <h1>Matching Information</h1>
                                {match ? (
                                    <>
                                        <div className="thumb-lg member-thumb mx-auto">
                                            <Image src={match.profile_image || "assets/images/faces/face15.jpg"} className="rounded-circle img-thumbnail" alt="profile-image" width={240} height={240} style={{ aspectRatio: '1/1'}} />
                                        </div>
                                        <h1 className='mt-3'>{match.name}</h1>
                                        <p className="text-white" style={{ fontSize: '24px' }}>Age: {match.age}</p>
                                        <p className="text-white" style={{ marginTop: '-15px', fontSize: '24px'  }}>Sex: {match.sex}</p>
                                        <p className="text-white" style={{ marginTop: '-15px', fontSize: '24px' }}>Contact: {match.contact_address}</p>
                                        <p className="text-white" style={{ marginTop: '-15px', fontSize: '24px' }}>Bio: {match.bio}</p>
                                        {loading ?
                                            <button type="button" className="btn btn-danger mt-3 waves-effect w-md waves-light" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Loading...</button>
                                        :
                                            <button type="button" className="btn btn-danger mt-3 waves-effect w-md waves-light" onClick={handleDoneClick} style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Done</button>
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
        // <div>
        //     {match ? (
        //         <div>
        //             <h1>Current Match</h1>
        //             <p>Name: {match.name}</p>
        //             <p>Email: {match.email}</p>
        //             <p>Contact: {match.contact_address}</p>
        //             {averageRating !== null && !isNaN(averageRating) ? (
        //                 <p>Partner's average rating: {averageRating.toFixed(2)}</p>
        //             ) : (
        //                 <p>No rating available</p>
        //             )}
        //             <button onClick={handleDoneClick}>Done</button>
        //         </div>
        //     ) : (
        //         <p>No current match found.</p>
        //     )}
            // <ReviewModal
            //     isOpen={isReviewModalOpen}
            //     onRequestClose={() => setIsReviewModalOpen(false)}
            //     onReviewSubmit={handleReviewSubmit}
            // />
        //     <button onClick={handleLogout}>Logout</button>
        // </div>
    );
}