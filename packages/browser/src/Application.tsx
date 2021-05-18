import React, { useEffect, useState } from "react"

export const Application = () => {
  const [state, setAppState] = useState<{
    state: string,
    data?: object | string
  }>({
    state: 'initial'
  });

  useEffect(() => {
    setAppState({
      state: 'loading'
    });
    fetch('http://localhost:5101/chronicles/adb9d048-cebf-4683-8762-f28c695f0b5d', {
      mode: 'cors'
    })
      .then(r => {
        if (r.ok) {
          return r.json()
        } else {
          return r.text()
        }
      })
      .then(r => {
        setAppState({
          state: 'loaded',
          data: r
        })
      })
  }, []);

  return (
    <>
      <div>{state.state}</div>
      <div>{JSON.stringify(state.data)}</div>
    </>
  )
}