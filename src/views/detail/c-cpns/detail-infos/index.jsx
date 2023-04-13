import React, { memo } from 'react'
import { useSelector,shallowEqual } from 'react-redux'

const DetailInfos = memo(() => {
  /** redux获取数据 */
  const {detailInfo} = useSelector((state)=>({
    detailInfo:state.detail.detailInfo
  }),shallowEqual)
  return (
    <div>
      <h2>{detailInfo?.name}</h2>
    </div>
  )
})

export default DetailInfos