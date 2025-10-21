import React, { useEffect, useState } from 'react'
import { IRound } from '../Interfaces/IRound'
import { IScorecard } from '../Interfaces/IScorecard'

interface Props {
    rounds: IRound[] | undefined
    scorecard: IScorecard
}

export default function ScorecardTotals(props: Props) {
    const { rounds } = props
    const [totalA, setTotalA] = useState(0)
    const [totalB, setTotalB] = useState(0)
    

    useEffect(() => {
        let fighterATotal = 0; let fighterBTotal = 0;
        
        // console.log(rounds, 'ROUNDS')
        rounds?.forEach(r => {
            if(r.isScored){
                fighterATotal += r.fighterA_Score
                fighterBTotal += r.fighterB_Score
            }
        })

        setTotalA(fighterATotal)
        setTotalB(fighterBTotal)
        // alert('test')
    }, [])

    useEffect(() => {
        let fighterATotal = 0; let fighterBTotal = 0;
        
        // console.log(rounds, 'ROUNDS')
        rounds?.forEach(r => {
            if(r.isScored){
                fighterATotal += r.fighterA_Score
                fighterBTotal += r.fighterB_Score
            }
        })

        setTotalA(fighterATotal)
        setTotalB(fighterBTotal)
        // alert('test')
    }, [rounds])

    return (

        <div className="scorecard-cell d-flex flex-column p-2 justify-content-evenly" style={{ border: '1px solid' }}>
            {/* <p style={{ position: 'absolute', marginTop: '-140px', marginLeft: '14px' }}>{round.roundNumber}</p> */}
            <p style={{ position: 'absolute', marginTop: '-112px', marginLeft: '7px', fontWeight: 'bold' }}>T</p>
            <p className='bold'>{totalA}</p>
            <p className='bold'>{totalB}</p>
            <p style={{ position: 'absolute', marginTop: '80px' }}>&nbsp;</p>

        </div>

    )
}
