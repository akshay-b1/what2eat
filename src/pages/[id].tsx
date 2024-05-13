// pages/[id].tsx
import { Survey } from '@/pages/survey';
import { useRouter } from 'next/router';

const EventPage = () => {
    const router = useRouter();
    const { id, surveyUsing } = router.query;
  
  return (
    <Survey id={id as string} surveyType={surveyUsing as string}/>
  );
};

export default EventPage;