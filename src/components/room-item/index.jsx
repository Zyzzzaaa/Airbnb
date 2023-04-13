import PropTypes from 'prop-types'
import React, { memo, useRef, useState } from 'react'
import { Carousel } from 'antd'
import { Rating } from '@mui/material'
import Lazyload from "react-lazyload";

import { ItemWrapper } from './style'
import IconArrowLeft from '@/assets/svg/icon-arrow-left';
import IconArrowRight from '@/assets/svg/icon-arrow-right';
import Indicator from '@/base-ui/indicator';
import loding from '@/assets/img/loding.jpeg'
import classNames from 'classnames';

const RoomItem = memo((props) => {
  const { itemData, itemWidth = "25%", itemClick } = props
  const [selectIndex, setSelectIndex] = useState(0)
  const sliderRef = useRef()

  // 左右箭头事件处理
  function controlClickHandle(isNext = true, event) {
    // 上一个面板/下一个面板
    isNext ? sliderRef.current.next(): sliderRef.current.prev()

    // 最新的索引
    let newIndex = isNext ? selectIndex + 1: selectIndex - 1
    //越界判断
    const length = itemData.picture_urls.length
    if (newIndex < 0) newIndex = length - 1
    if (newIndex > length - 1) newIndex = 0
    setSelectIndex(newIndex)

    // 阻止事件冒泡
    event.stopPropagation()
  }
  //entire-rooms的回调函数
  function itemClickHandle() {
    if (itemClick) itemClick(itemData)
  }

  // 普通的图片展示
  const pictureElement = (
    <Lazyload placehodler={
      <div className='cover'>
        <img src={loding} alt="" />
      </div>
    }>
      <div className='cover'>
        <img src={itemData.picture_url} alt="" />
      </div>
    </Lazyload>
  )
  // 有轮播效果的图片展示
  const sliderElement = (
    <div className='slider'>
      {/* 左右按钮 */}
      <div className='control'>
        <div className='btn left' onClick={e => controlClickHandle(false, e)}>
          <IconArrowLeft width="30" height="30"/>
        </div>
        <div className='btn right' onClick={e => controlClickHandle(true, e)}>
          <IconArrowRight width="30" height="30"/>
        </div>
      </div>
      {/* 指示器 */}
      <div className='indicator'>
        <Indicator selectIndex={selectIndex}>
          {
            itemData?.picture_urls?.map((item, index) => {
              return (
                <div className="item" key={item}>
                  <span className={classNames("dot", { active: selectIndex === index })}></span>
                </div>
              )
            })
          }
        </Indicator>
      </div>
      {/* 轮播图 */}
      <Carousel dots={false} ref={sliderRef}>
        {
          itemData?.picture_urls?.map(item => {
            return (
              <Lazyload placeholder={
                <div className='cover' key={item}>
                  <img src={loding} alt="" />
                </div>
              }>
                  <div className='cover' key={item}>
                  <img src={item} alt="" />
              </div>
              </Lazyload>
            )
          })
        }
      </Carousel>
    </div>
  )

  return (
    <ItemWrapper 
      verifyColor={itemData?.verify_info?.text_color || "#39576a"}
      itemWidth={itemWidth}
      onClick={itemClickHandle}
    >
      <div className='inner'>
        { !itemData.picture_urls ? pictureElement: sliderElement }
        <div className='desc'>
          {itemData.verify_info.messages.join(" · ")}
        </div>
        <div className='name'>{itemData.name}</div>
        <div className='price'>¥{itemData.price}/晚</div>

        <div className='bottom'>
          {/* 星星 */}
          <Rating 
            // 必须是??
            value={itemData.star_rating ?? 5}
            precision={0.1}
            readOnly 
            sx={{ fontSize: "12px", color: "#00848A", marginRight: "-1px" }}
          />
          <span className='count'> 评论量：{itemData.reviews_count}</span>
        </div>
      </div>
    </ItemWrapper>
  )
})

RoomItem.propTypes = {
  itemData: PropTypes.object
}

export default RoomItem