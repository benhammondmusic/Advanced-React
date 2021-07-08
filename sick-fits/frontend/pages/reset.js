/* eslint-disable react/prop-types */

import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <>
        <p>Sorry, no token found</p>
        <RequestReset />
      </>
    );
  }
  return (
    <>
      <Reset token={query.token} />
    </>
  );
}
