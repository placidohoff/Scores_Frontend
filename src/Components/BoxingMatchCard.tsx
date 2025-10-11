import React, { useEffect, useState } from 'react'
import { IBoxingMatch } from '../Interfaces/IBoxingMatch'
import { IFighter } from '../Interfaces/IFighter'
import { useNavigate } from 'react-router-dom'

interface Props {
  boxingMatch: IBoxingMatch,
  fighters: IFighter[]
}


export default function BoxingMatchCard(props: Props) {
  let { fighters, boxingMatch } = props
  const [fighterAName, setFighterAName] = useState('');
  const [fighterBName, setFighterBName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fighters.forEach(f => {
      if (f.fighter_ID === boxingMatch.fighterA_ID)
        setFighterAName(f.firstname + ' ' + f.lastname);
      if (f.fighter_ID === boxingMatch.fighterB_ID)
        setFighterBName(f.firstname + ' ' + f.lastname);
    });
  }, [fighters, boxingMatch]);

  return (
    <div onClick={() => navigate('/create-scorecard', {
      state: {
        fighterAName,
        fighterBName,
        boxingMatchID: boxingMatch.boxingMatch_ID

      }
    })} className="boxingMatchCard" style={{ borderBottom: '1px solid' }}>
      <p className='mb-0'>{fighterAName} vs {fighterBName}</p>
    </div>
  );
}
