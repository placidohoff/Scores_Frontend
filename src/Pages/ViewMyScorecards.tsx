import React from 'react'
import { useAuth } from '../Context/auth'
import { FadeInSection, ViewListUserScorecards } from '../Components';
// import { useData } from '../Context/data';

export default function ViewMyScorecards() {
  const { auth } = useAuth();
  // const { ctxFighters } = useData();
  return (
    <>
      <h1>Welcome {auth.user}</h1>
      <FadeInSection>
        <ViewListUserScorecards />
      </FadeInSection>
    </>
  )
}
