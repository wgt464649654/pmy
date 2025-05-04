import { AimOutlined } from "@ant-design/icons";
import { Card, Empty, Modal } from "antd";
import { AnImg, LightDiv, LineItem } from "./styles";
import { useEffect, useMemo, useRef, useState } from "react";
import lightPng from './light1.png'
import anPng from './anan.png'
import { canConnect } from "./util";

export default function Line(props) {
  const { value, scale = 1, showLight = true, isPreview, testLines, onChange } = props

  const {
    num,
    lines: rightLines = [],
    lightLines =  []
  } = value || {}

  const lines = isPreview ? rightLines : testLines

  // console.log('111', lines, rightLines)

  const [current, setCurrent] = useState<number | undefined>()
  const [isImgCheck, setIsImgCheck] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const containRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawLines = () => {
      if (!containRef.current) return

      const canvas = canvasRef.current;
      if (!canvas) return

      canvas.width = containRef.current.offsetWidth
      canvas.height = containRef.current.offsetHeight
      const ctx = canvas.getContext('2d');
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { children } = lineRef.current
      const boxRect = lineRef.current.getBoundingClientRect()

      lines.forEach(line => {
        const [pre, next] = line
        // 获取两个点的坐标
        const start = children[pre].getBoundingClientRect()
        const end = children[next].getBoundingClientRect()
        // 绘制直线
        ctx.beginPath();
        // 设置线的颜色
        ctx.strokeStyle = '';
        ctx.moveTo(start.left - boxRect.left + 66, start.top - boxRect.top + 50 + 55);
        ctx.lineTo(end.left - boxRect.left + 66, end.top - boxRect.top + 50 + 55);
        ctx.stroke();
      });

      // 绘制灯泡线
      if (lightRef.current) {
        const lightRect = lightRef.current.getBoundingClientRect()
        lightLines.forEach(light => {
          // 获取两个点的坐标
          const start = children[light].getBoundingClientRect()
          // 绘制直线
          ctx.beginPath();
          // 设置线的颜色
          ctx.strokeStyle = '';
          ctx.moveTo(lightRect.left - boxRect.left + 200, lightRect.top - boxRect.top + 50 + 55);
          ctx.lineTo(start.left - boxRect.left + 66, start.top - boxRect.top + 50 + 55);
          ctx.stroke();
        })
      }
    };

    drawLines()
  }, [lines, num, isPreview, lightLines, testLines]);

  useEffect(() => {
    document.addEventListener('click', () => {
     setIsImgCheck(false)
   })
  }, [])

  const renderColor = (i: number) => {
    if (current === i) {
      return '#52C41A'
    } else if (lines.some(line => line.includes(i))) {
      return isPreview ? '#1677FF' : ''
    } else {
      return '#000'
    }
  }

  useEffect(() => {
    if (current !== undefined && isImgCheck) {
      const ok = () => {
        setIsImgCheck(false)
        setCurrent(undefined)
      }
      if (lightLines.includes(current)) {
        // 已经有了 就取消
        onChange({
          ...value,
          lines,
          lightLines: lightLines.filter(l => l !== current)
        })
        ok()
      } else {
        if (lightLines.length >= 2) {
          Modal.confirm({
            title: '提示',
            content: '灯泡最多只能测试两个接线柱，是否重置？',
            cancelText: '取消',
            okText: '重置',
            onCancel: () => { },
            onOk: () => {
              // 连接灯泡和线
              onChange({
                ...value,
                lines,
                lightLines: [current]
              })
              ok()
            }
          })
        } else {
          // 连接灯泡和线
          onChange({
            ...value,
            lines,
            lightLines: [...lightLines, current]
          })
          ok()
        }
      }
    }
  }, [isImgCheck, current, lines])

  const toConnect = (i: number) => {
    if (current === undefined) {
      setCurrent(i)
    } else if (current === i) {
      setCurrent(undefined)
    } else {
      // 判断lines当中有没有i，有的话删掉，重新连接
      const newLine = [current, i]
      const newLines = lines.filter(line => !(line.includes(current) && line.includes(i)))
      if (newLines.length === lines.length) {
        // 没有被过滤掉的
        newLines.push(newLine)
        onChange({
          ...value,
          lines: newLines
        })
      } else {
        onChange({
          ...value,
          lines: newLines
        })
      }
      setCurrent(undefined)
    }
  }

  const checkLightImg = (e) => {
    // 停止冒泡
    e.stopPropagation()
    setIsImgCheck(true)
  }
  
  const checkAnImg = (e) => {
    // 停止冒泡
    e.stopPropagation()
    setIsImgCheck(true)
  }

  const isLight = useMemo(() => {
    // 判断
    return canConnect(lightLines, rightLines)
  }, [lightLines, rightLines])

  if (!num) {
    return <Empty description='请先设置接线柱数量' image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <div ref={containRef} style={{ position: 'relative' ,border: '1px solid #f0f0f0', borderRadius: 8, width: 410 }}>
        <LightDiv ref={lightRef}>
          <img style={{ display: isLight?'block':'none', width: 50, height: 50, borderRadius: '25px' }} src={lightPng} onClick={checkLightImg} />
          <AnImg style={{ display: isLight?'none':'block', width: 50, height: 50, filter: 'grayscale(100%)', borderRadius: '25px', cursor: 'pointer', border: isImgCheck?'1px solid red':'' }} src={anPng} onClick={checkAnImg} />
        </LightDiv>
        <div ref={lineRef} style={{ position: 'relative' ,display: 'flex', flexWrap:'wrap' }}>
          {new Array(num).fill(0).map((_, i) => (
            <div key={i} style={{ width: 100, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <LineItem onClick={() => toConnect(i)}><div style={{ width: 30 }}>{i}.</div><AimOutlined key={i} style={{ fontSize: 24, color: renderColor(i) }} /></LineItem>
            </div>
          ))}
        </div>

        <canvas
          key={num}
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, border: '0px solid red', pointerEvents: 'none' }}
        />
      </div>
    </div>
  )
}