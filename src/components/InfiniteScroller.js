import React, { useEffect, useCallback, useRef } from 'react'

const InfiniteScroller = ({ isLoading, Loader, items, fetchData, HasMore }) => {
  const loaderRef = useRef()
  const fetchMore = useCallback(
    (entries) => {
      if (isLoading) return
      if (entries[0].isIntersecting) {
        fetchData()
      }
    },
    [isLoading, fetchData],
  )
  useEffect(() => {
    const observer = new IntersectionObserver(fetchMore, { threshold: 1 })
    let currentRef = loaderRef.current
    let timer = setTimeout(() => {
      observer.observe(currentRef)
    }, 500)
    return () => {
      clearTimeout(timer)
      observer.unobserve(currentRef)
    }
  }, [loaderRef, fetchMore])
  return (
    <div>
      {items}
      <HasMore />
      <div ref={loaderRef}> {isLoading ? <Loader /> : ''}</div>
    </div>
  )
}

export default InfiniteScroller
