import { Fragment } from 'react';
import { useRouter } from 'next/router';

import { getAllEvents } from '../../helper/api-util';
import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';

function AllEventsPage(props) {
  const router = useRouter();
  const events = props.events;

  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;
    
    router.push(fullPath);
  }

  return (
    <Fragment>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  );
}

export async function getStaticProps(){
  const events = await getAllEvents();
  return {
    props:{
      events:events
    },
    revalidate:1800
  }

  
}
export default AllEventsPage;
