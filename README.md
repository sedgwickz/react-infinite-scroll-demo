# 简介 React-Infinite-Scroll-Demo

React 无限滚动加载更多，在线 Demo 展示：[https://react-infinite-scroll-demo.vercel.app](https://react-infinite-scroll-demo.vercel.app)

## Installation 安装

`npm i @sedgwickz/react-infinite-scroll`

or

`yarn add @sedgwickz/react-infinite-scroll`

## Usage 使用

以下是使用 graphql 接口使用实例，更多详情可参考本项目源代码

```
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

```

## Licence

MIT
