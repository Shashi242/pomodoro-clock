import React, {useState, useEffect} from 'react';
import "./App.css";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [flag , setFlag] =  useState(false);
  const [worksecond, setWorkSecond] = useState(1500);
  const [breaksecond, setBreakSecond] = useState(300);
  const [type, setType] = useState('work');
  const [resetFlag, setResetFalg] = useState(true);
  const [cycleLimit,setCycleLimit] = useState(null);
  const [isTrue,setIsTrue] = useState(false);
  const [cycleLeft,setCycleLeft] = useState(0);

  useEffect(() =>{
    if(isTrue){
      setCycleLeft(cycleLimit);
    }
    if(cycleLimit===0){
      setFlag(false);
      setResetFalg(true);
      setIsTrue(false);
    }
    if(flag===true && isTrue===false){
      toast("Please set the cycle limit", {
        position: toast.POSITION.TOP_CENTER
    });
      setFlag(false);
      setResetFalg(true);
    }
   if(isTrue && cycleLimit>0){
    if(flag && type === 'work'){
      if(worksecond > 0) {
        const timer = setTimeout(() => setWorkSecond(worksecond - 1), 1000);
        return () => clearTimeout(timer);
      }
      if(worksecond === 0) {
        toast('work duration is over', {
          position: toast.POSITION.TOP_CENTER
      })
        setType('break');
        setWorkSecond(workDuration * 60);
      }
    }
    if(flag && type === 'break'){
      if(breaksecond > 0) {
        const timer = setTimeout(() => setBreakSecond(breaksecond - 1), 1000);
        return () => clearTimeout(timer);
      }
      if(breaksecond === 0) {
        toast('break duration is over', {position: toast.POSITION.TOP_CENTER});
        setType('work');
        setBreakSecond(breakDuration * 60);
        setCycleLimit(cycleLimit-1);
      }
    }
  }
  },[flag, type, worksecond, breaksecond, workDuration, breakDuration, isTrue]);

  const reset = () =>{
      setResetFalg(true);
      setFlag(false);
      setType('work');
      setWorkDuration(25);
      setBreakDuration(5);
      setBreakSecond(300);
      setWorkSecond(1500);
      setIsTrue(false);
  }

  const convertToStandardFormat = (sec) =>{
    let m = parseInt(sec / 60).toString();
    let s = parseInt(sec % 60).toString();
    if(m.length === 1) m = '0' + m;
    if(s.length === 1) s = '0' + s;
    return m + ":" + s;
  }
  const validateData = (data) =>{
    if(!isNaN(data) && parseInt(data) >= 0){
      return parseInt(data);
    }
    else
      return '';
  }
  const setDuration = (e) =>{
    e.preventDefault();
    if(breakDuration + workDuration <= 0){
      reset();
      return ;
    }
    setResetFalg(false);
    setType('work');
    setWorkSecond(workDuration * 60);
    setBreakSecond(breakDuration * 60);
  }
  return (
    <>
    <div className='heading'>
      <h1>Pomodoro Clock</h1>
    </div>
    <div className="App" style={{textAlign: "center"}}>
      <div className='clockHeadParent'>
        <div className='clockHead'>
          <span>Work Time: 25</span>
          <span>Break Time: 5</span>
        </div>
        <div className='spn'>Cycle Left: {cycleLeft}</div>
      </div>
      <div className='clock'>
      <h1 className='timer'>{(type === 'work') ? convertToStandardFormat(worksecond): convertToStandardFormat(breaksecond) }</h1>
      <h3>{(type === 'work') ? 'Work' : 'Break'}-Time</h3>
      </div>

      {/* <br></br> */}
      <div className='parameters'>
        <form onSubmit={setDuration} className='input'>
        <span>Set limitations of cycle</span>
        <input data-testid='break-duration' className='inp' placeholder='cycle limit' required type='Number' value={cycleLimit} disabled={isTrue} onChange={(e) => setCycleLimit(e.target.value)}></input>
        <button data-testid='set-btn' 
        onClick={()=>{
          if(cycleLimit<=0){
            toast("Cycle limit should be greater than 0",{position: toast.POSITION.TOP_CENTER});
          }
          else{
            setIsTrue(true);
          }
          }} className='btn' type='submit' disabled={isTrue}>Set</button>
        </form>
      </div>

      <br></br>
      <div className='control'>
      <button data-testid='start-btn' key='start' onClick={ () => {setFlag(true); setResetFalg(false);}} disabled={flag} >start</button>
      <button data-testid='stop-btn' key='stop' onClick={() => {setFlag(false); setResetFalg(false)}} disabled={!flag}>Stop</button>
      <button data-testid='reset-btn' key='reset' onClick={() => {reset()}} disabled={resetFlag}>Reset</button>
      </div>
      <ToastContainer/>
      </div>
      </>
  );
}

export default App;