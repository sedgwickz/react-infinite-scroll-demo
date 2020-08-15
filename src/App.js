import React from 'react'
import DataList from './components/DataList'
// import { Hello } from '@sedgwickz/hello'

// const Foo = ({ children }) => {
//   return <div>Foo {children}</div>
// }

// const Bob = () => <div>22222222</div>

function App() {
  return (
    <div className="App">
      {/* <Hello isLoading="true" Loader={<Bob />} />
      <Foo>
        <Bob />
      </Foo> */}
      <DataList />
    </div>
  )
}

export default App
