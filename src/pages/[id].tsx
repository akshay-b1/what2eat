// pages/[id].tsx
import { Survey } from '@/pages/survey';
import { useRouter } from 'next/router';

const EventPage = () => {
    const router = useRouter();
    const { id } = router.query;
  
  return (
    <Survey id={id as string} />
  );
};

export default EventPage;