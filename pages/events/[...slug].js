import { Fragment,useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { getFilteredEvents } from '../../helper/api-util';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { notFound } from 'next/navigation';

function FilteredEventsPage(props) {
  const [loadedEvents,setloadedEvents] = useState();
  const { error, setError } = useState(false);
  const router = useRouter();
  const filterData = router.query.slug;

  // const {data, error} = useSWR('https://next-js-3bbeb-default-rtdb.firebaseio.com/events.json');

  // useEffect(()=>{
  //   if(data){
  //     const events = [];

  //     for(const key in data){
  //         events.push({
  //             id:key,
  //             ...data[key]
  //         })
  //     }
  //     setloadedEvents(events)
  //   }
  // },[data]);
  useEffect(() => {
    fetch('https://next-js-3bbeb-default-rtdb.firebaseio.com/events.json')
      .then((response) => response.json())
      .then((data) => {
          if(data){
            const events = [];

            for(const key in data){
                events.push({
                    id:key,
                    ...data[key]
                })
            }
            setloadedEvents(events)
          }
          else
          setError(true)
      });
  }, []);

  //const filteredEvents = props.filteredEvents
  //const Filterdate = props.date


  if (!loadedEvents) {
    return <p className='center'>Loading...</p>;
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (  
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 ||
    error
  ) {
      return (
        <Fragment>
          <ErrorAlert>
            <p>Invalid filter. Please adjust your values!</p>
          </ErrorAlert>
          <div className='center'>
            <Button link='/events'>Show All Events</Button>
          </div>
        </Fragment>
      );
    }


  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
  });
  



  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

// export async function getServerSideProps(context){
//   const {params} = context

//   const filterData = params.slug;

//   const filteredYear = filterData[0];
//   const filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2030 ||
//     numYear < 2021 ||
//     numMonth < 1 ||
//     numMonth > 12
//   ) {
//     return {
//       props:{hasError:true}
//     }
//   }
//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   });

//   return {
//     props:{
//       filteredEvents:filteredEvents,
//       date:{
//         year:numYear,
//         month:numMonth
//       }
//     }
//   };
// }
export default FilteredEventsPage;
