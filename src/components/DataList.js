import React, { useState } from 'react'
import { gql, request } from 'graphql-request'
import { InfiniteScroller } from '@sedgwickz/react-infinite-scroll'
const Loader = (isLoading) => {
  return <div>{isLoading ? 'Loading...' : ''}</div>
}

const HasMore = (hasNext) => {
  return <div style={{ textAlign: 'center' }}>{hasNext ? '' : 'No More'}</div>
}

const quoteQuery = gql`
  query getQuotes($first: Int, $after: String) {
    items(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNext
      }
      edges {
        node {
          id
          quote
          author
        }
      }
      totalCount
    }
  }
`

export default () => {
  const [data, setData] = useState({
    pageInfo: { hasNext: true },
    totalCount: 0,
    edges: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const fetchData = async () => {
    if (data.pageInfo && !data.pageInfo.hasNext) return
    const endpoint =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/graphql'
        : 'https://magical-paint-hubcap.glitch.me/graphql'

    setIsLoading(true)
    const res = await request(endpoint, quoteQuery, {
      first: 10,
      after: data.pageInfo.endCursor,
    })
    if (res.items) {
      setData((prev) => {
        return {
          ...prev,
          pageInfo: res.items.pageInfo,
          edges: [...prev.edges, ...res.items.edges],
          totalCount: res.items.totalCount,
        }
      })
    }
    setIsLoading(false)
  }

  return (
    <div>
      <h1>React-Infinite-Scroll-Demo</h1>
      <div>totalCount: {data.totalCount}</div>
      <InfiniteScroller
        isLoading={isLoading}
        loader={Loader(isLoading)}
        hasMore={HasMore(data.pageInfo.hasNext)}
        fetchData={fetchData}
      >
        {data &&
          data.edges &&
          data.edges.map((edge) => {
            return (
              <div key={edge.node.id} style={{ margin: '40px' }}>
                <div>cursor: {edge.node.id}</div>
                {edge.node.quote}
              </div>
            )
          })}
      </InfiniteScroller>
    </div>
  )
}
