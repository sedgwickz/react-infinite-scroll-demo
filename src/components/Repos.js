import React, { useState, useEffect, useRef, useCallback } from 'react'
import { gql, GraphQLClient } from 'graphql-request'
export default function Repos() {
  const [data, setData] = useState({
    pageInfo: {},
    edges: [],
    repositoryCount: 0,
  })
  const [keyword, setKeyword] = useState()
  const [loading, setLoading] = useState(false)
  const scroller = useRef(null)

  const sendRequest = useCallback(async () => {
    const endpoint = 'https://api.github.com/graphql'
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
      },
    })
    const after = data['pageInfo']['endCursor']
      ? `"${data['pageInfo']['endCursor']}"`
      : null
    const query = gql`
    {
        rateLimit {
          remaining
        }
        search(query: "${keyword}", type: REPOSITORY, first: 25, after: ${after}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              ... on Repository {
                id
                nameWithOwner
                url
                stargazers {
                    totalCount
                  }
              }
            }
          }
        }
      }
    `
    setLoading(true)
    const res = await client.request(query)
    if (res.search) {
      setData((prev) => {
        return {
          ...prev,
          pageInfo: res.search.pageInfo,
          edges: [...prev.edges, ...res.search.edges],
          repositoryCount: res.search.repositoryCount,
        }
      })
    }
    setLoading(false)
  }, [keyword, data])

  const fetchData = useCallback(
    (entries) => {
      if (!keyword || loading) return
      if (entries[0].isIntersecting) {
        sendRequest()
      }
    },
    [keyword, loading, sendRequest],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(fetchData, {
      threshold: 1,
    })
    let loader = scroller.current
    let timer = setTimeout(() => {
      observer.observe(loader)
    }, 500)
    return () => {
      clearTimeout(timer)
      observer.unobserve(loader)
    }
  }, [scroller, fetchData])

  return (
    <div>
      <div>Repos {process.env.REACT_APP_TOKEN}</div>
      <div>
        Project name: <input onChange={(e) => setKeyword(e.target.value)} />
      </div>
      <div>
        {data &&
          data.edges &&
          data.edges.map((edge) => {
            return (
              <div key={edge.cursor} style={{ height: '30px' }}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={edge.node.url}
                >
                  {edge.node.nameWithOwner}
                </a>
                <strong>
                  <span role="img" aria-label="Star {edge.node.url}">
                    ⭐️
                  </span>
                  {edge.node.stargazers.totalCount}
                </strong>
              </div>
            )
          })}
      </div>
      <div ref={scroller}>{loading && 'loading...'}</div>
    </div>
  )
}
