import React from 'react';

export default function ProductReviewAnalytics({ analytics }) {
	const totalReviews = analytics?.total_reviews || 0;
	const averageRating = analytics?.average_rating || 0;
	const ratingCounts = [
		analytics?.rating_1_count || 0,
		analytics?.rating_2_count || 0,
		analytics?.rating_3_count || 0,
		analytics?.rating_4_count || 0,
		analytics?.rating_5_count || 0,
	];

	if (!totalReviews) {
		return null;
	}

	return (
		<div className="product-review-analytics">
			<div className="product-review-analytics__left-column">
				<div className="product-review-analytics__total-reviews-wrapper">
					<h3 className="product-review-analytics__average-rating">
						{averageRating.toFixed(1)}
					</h3>
					<div>
						<span className="product-review-analytics__rating-stars" aria-hidden="true">
							{'★★★★★'.slice(0, Math.round(averageRating))}
						</span>
						<p>{`${totalReviews} ${totalReviews === 1 ? 'reseña' : 'reseñas'}`}</p>
					</div>
				</div>
			</div>
			<div className="product-review-analytics__right-column">
				<div className="product-review-analytics__grid">
					{[5, 4, 3, 2, 1].map((rating) => (
						<div key={rating} className="product-review-analytics__row">
							<span className="product-review-analytics__star" aria-hidden="true">★</span>
							<p className="product-review-analytics__rating-label">{rating}</p>
							<div className="product-review-analytics__bar-container">
								<div
									className="product-review-analytics__rating-bar"
									style={{
										width: `${(ratingCounts[rating - 1] / totalReviews) * 100}%`,
										backgroundColor: 'currentColor',
									}}
								/>
							</div>
							<p className="product-review-analytics__rating-count">{ratingCounts[rating - 1]}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
