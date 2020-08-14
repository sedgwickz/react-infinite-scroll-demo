import React, { useState } from 'react'
import { gql, GraphQLClient } from 'graphql-request'
import InfiniteScroller from './InfiniteScroller'

const Loader = () => {
  return 'loading...'
}

const Item = ({ edge }) => {
  return (
    <div style={{ margin: '40px' }}>
      <div>cursor: {edge.node.id}</div>
      {edge.node.quote}
    </div>
  )
}

// const query = gql`
//   query searchQuery($keyword: String!, $after: String) {
//     rateLimit {
//       remaining
//     }
//     search(query: $keyword, type: REPOSITORY, first: 10, after: $after) {
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       edges {
//         cursor
//         node {
//           ... on Repository {
//             id
//             nameWithOwner
//             url
//             stargazers {
//               totalCount
//             }
//           }
//         }
//       }
//     }
//   }
// `
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
    //const endpoint = 'https://api.github.com/graphql'  // used for test github api v4
    //const endpoint = 'https://magical-paint-hubcap.glitch.me/graphql' // product url
    //const endpoint = 'http://localhost:5000/graphql' // dev url
    const endpoint =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/graphql'
        : 'https://magical-paint-hubcap.glitch.me/graphql'
    const client = new GraphQLClient(endpoint, {
      //   headers: {
      //     authorization: `Bearer your person token for test github graphql api`,
      //   },
    })
    setIsLoading(true)
    const res = await client.request(quoteQuery, {
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
        Loader={Loader}
        HasMore={() => (
          <div style={{ textAlign: 'center' }}>
            {data.pageInfo.hasNext ? '' : 'No More'}
          </div>
        )}
        fetchData={fetchData}
        items={
          data &&
          data.edges &&
          data.edges.map((edge) => {
            return <Item key={edge.node.id} edge={edge} />
          })
        }
      ></InfiniteScroller>
    </div>
  )
}
