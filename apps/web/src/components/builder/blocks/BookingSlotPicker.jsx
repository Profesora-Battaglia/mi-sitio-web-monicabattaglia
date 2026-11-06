import React, {
	useEffect,
	useRef,
	useState,
} from 'react';

const AVAILABILITY_WINDOW_DAYS = 60;

/** The `lt` locale is the shortest way to get the `YYYY-MM-DD` the booking endpoints expect. */
const toApiDate = (date) => new Intl.DateTimeFormat('lt').format(date);

export const getBookingTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const formatDateLabel = (value) => {
	const [year, month, day] = value.split('-').map(Number);

	return new Date(year, month - 1, day).toLocaleDateString(undefined, {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});
};

/** Slots are wall-clock strings with no offset, so build the Date from parts rather than parsing. */
const formatSlotLabel = (value) => {
	const [datePart, timePart = ''] = value.split('T');
	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute] = timePart.split(':').map(Number);

	return new Date(year, month - 1, day, hour || 0, minute || 0).toLocaleTimeString(undefined, {
		hour: 'numeric',
		minute: '2-digit',
	});
};

export default function BookingSlotPicker({
	bookingEventId,
	timeZone,
	selectedSlot,
	onSelectSlot,
}) {
	const [availableDates, setAvailableDates] = useState([]);
	const [selectedDate, setSelectedDate] = useState('');
	const [slots, setSlots] = useState([]);
	const [isLoadingDates, setIsLoadingDates] = useState(false);
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);
	const [error, setError] = useState('');
	const slotsRequestRef = useRef(0);

	useEffect(() => {
		let cancelled = false;

		// A slot belongs to the event it was picked from, so drop it before the new event loads
		// rather than after: until then the parent would still check out the previous event's time.
		onSelectSlot('');

		if (!bookingEventId) {
			setAvailableDates([]);
			setSelectedDate('');

			return undefined;
		}

		const loadDates = async () => {
			setIsLoadingDates(true);
			setError('');

			try {
				const api = await import('@/api/EcommerceApi.js');

				if (!api.getAvailability) {
					if (!cancelled) {
						setAvailableDates([]);
						setError('Las reservas no están disponibles en este sitio.');
					}

					return;
				}

				const fromDate = new Date();
				const toDate = new Date();

				toDate.setDate(toDate.getDate() + AVAILABILITY_WINDOW_DAYS);

				const result = await api.getAvailability({
					bookingEventId,
					fromDate: toApiDate(fromDate),
					toDate: toApiDate(toDate),
					timeZone,
				});
				const dates = result?.available_dates || [];

				if (!cancelled) {
					setAvailableDates(dates);
					setSelectedDate(dates[0] || '');
				}
			} catch (err) {
				console.warn('[BookingSlotPicker] failed to load availability', err);

				if (!cancelled) {
					setAvailableDates([]);
					setError('No se pudieron cargar los días disponibles.');
				}
			} finally {
				if (!cancelled) {
					setIsLoadingDates(false);
				}
			}
		};

		loadDates();

		return () => {
			cancelled = true;
		};
	}, [bookingEventId, timeZone, onSelectSlot]);

	useEffect(() => {
		if (!bookingEventId || !selectedDate) {
			setSlots([]);

			return;
		}

		slotsRequestRef.current += 1;
		const requestId = slotsRequestRef.current;

		const loadSlots = async () => {
			setIsLoadingSlots(true);

			try {
				const api = await import('@/api/EcommerceApi.js');

				if (!api.getTimeSlots) {
					if (requestId === slotsRequestRef.current) {
						setSlots([]);
						setError('Las reservas no están disponibles en este sitio.');
					}

					return;
				}

				const result = await api.getTimeSlots({
					bookingEventId,
					date: selectedDate,
					timeZone,
				});

				// A slower earlier request must not overwrite the day the visitor is now looking at.
				if (requestId === slotsRequestRef.current) {
					setSlots(result?.slots || []);
				}
			} catch (err) {
				console.warn('[BookingSlotPicker] failed to load time slots', err);

				if (requestId === slotsRequestRef.current) {
					setSlots([]);
					setError('No se pudieron cargar los horarios para ese día.');
				}
			} finally {
				if (requestId === slotsRequestRef.current) {
					setIsLoadingSlots(false);
				}
			}
		};

		loadSlots();
	}, [bookingEventId, selectedDate, timeZone]);

	const handleSelectDate = (date) => {
		setSelectedDate(date);
		setError('');
		onSelectSlot('');
	};

	if (!bookingEventId) {
		return null;
	}

	return (
		<div className="block-product__booking">
			{isLoadingDates ? (
				<p className="block-product__booking-status">Cargando días disponibles…</p>
			) : null}

			{!isLoadingDates && !error && !availableDates.length ? (
				<p className="block-product__booking-status">No hay días disponibles para reservar.</p>
			) : null}

			{availableDates.length ? (
				<>
					<div className="block-product__booking-group">
						<span className="block-product__booking-label">Elegí un día</span>
						<div className="block-product__booking-options">
							{availableDates.map((date) => (
								<button
									key={date}
									type="button"
									aria-pressed={date === selectedDate}
									className={[
										'block-product__booking-option',
										date === selectedDate ? 'block-product__booking-option--selected' : '',
									].filter(Boolean).join(' ')}
									onClick={() => handleSelectDate(date)}
								>
									{formatDateLabel(date)}
								</button>
							))}
						</div>
					</div>

					<div className="block-product__booking-group">
						<span className="block-product__booking-label">Elegí un horario</span>

						{isLoadingSlots ? (
							<p className="block-product__booking-status">Cargando horarios…</p>
						) : null}

						{!isLoadingSlots && !slots.length ? (
							<p className="block-product__booking-status">No quedan horarios para este día.</p>
						) : null}

						{!isLoadingSlots && slots.length ? (
							<div className="block-product__booking-options">
								{slots.map((slot) => (
									<button
										key={slot}
										type="button"
										aria-pressed={slot === selectedSlot}
										className={[
											'block-product__booking-option',
											slot === selectedSlot ? 'block-product__booking-option--selected' : '',
										].filter(Boolean).join(' ')}
										onClick={() => onSelectSlot(slot)}
									>
										{formatSlotLabel(slot)}
									</button>
								))}
							</div>
						) : null}

						<p className="block-product__booking-timezone">{`Horarios en ${timeZone}`}</p>
					</div>
				</>
			) : null}

			{error ? <p className="block-product__checkout-error">{error}</p> : null}
		</div>
	);
}
