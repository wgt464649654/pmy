import { GlobalStyle } from './styles/GlobalStyle'

import Test from './components/Test'
import { useEffect, useState } from 'react'
import { generateRandomConnections, pmyma, TabEnum } from './util'
import { Container } from './components/Button/styles'
import { Title } from './components/Greetings/styles'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Result,
  Row,
  Typography,
} from 'antd'
import Line from './components/Line'
import { canConnect, isSame } from './components/Line/util'

export function App() {
  const [tab, setTab] = useState(TabEnum.home)
  const [stuLightLines, setStuLightLines] = useState<any[]>([])
  const [stuLinesLook, setStuLinesLook] = useState<any[]>([])
  const [stuLines, setStuLines] = useState<any[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({})
  const [fillResult, setFillResult] = useState(false)
  const [layout, setLayout] = useState<{
    num: number,
    lines: number[][],
    lightLines: number[][]
  }>({
    num: 0,
    lines: [],
    lightLines: []
  })

  const [form] = Form.useForm()
  const [pswForm] = Form.useForm()

  const zNumber = Form.useWatch('zNumber', form)
  const lNumber = Form.useWatch('lNumber', form)

  useEffect(() => {
    if (zNumber) {
      form.setFieldsValue({
        lNumber: ''
      })
      setLayout({
        num: zNumber,
        lines: [],
        lightLines: []
      })
    }
  }, [zNumber])

  useEffect(() => {
    if (lNumber) {
      setLayout(e => ({
        ...e,
        lines: generateRandomConnections(zNumber, lNumber),
        lightLines: []
      }))
    }
  }, [lNumber])

  const reset = () => {
    form.setFieldValue('layout', {
      ...form.getFieldValue('layout'),
      lines: [],
      lightLines: [],
    })
  }

  const preStep = (cb?: any) => {
    Modal.confirm({
      title: '输入密码',
      content: (
        <Form form={pswForm}>
          <Form.Item
            name="psw"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        pswForm.validateFields().then(res => {
          pswForm.resetFields()
          if (res.psw === pmyma) {
            setTab(TabEnum.home)
            clearStu()
            setTimeout(() => {
              form.setFieldsValue({
                ...formData
              })
            })
            typeof cb === 'function' && cb()
          } else {
            message.error('密码错误')
          }
        })
      },
    })
  }

  const clearStu = () => {
    setStuLightLines([])
    setStuLines([])
    setIsSuccess(false)
  }

  const stopExame = () => {
    preStep()
  }

  const testLine = i => {
    const lastItem = stuLightLines[stuLightLines?.length - 1]
    if (lastItem) {
      if (lastItem.includes(i)) {
        // 去掉这一项
        setStuLightLines(e => [...e.slice(0, e.length - 1), lastItem.filter(e => e !== i)])
      } else if (lastItem.length === 0) {
        // 空数组
        setStuLightLines(e => [...e.slice(0, e.length - 1), [i]])
      } else if (lastItem.length === 1) {
        // 添加这一项
        setStuLightLines(e => [...e.slice(0, e.length - 1), [...lastItem, i]])
      } else if (lastItem.length === 2) {
        // 重新再建一条
        setStuLightLines(e => [...e, [i]])
      }
    } else {
      setStuLightLines(e => [...e, [i]])
    }
  }

  const submit = () => {
    if (!layout?.lines?.length) {
      return message.warning('请先设置布局')
    }
    const isOk = isSame(stuLines, layout?.lines)
    setTab(TabEnum.result)
    setIsSuccess(isOk)
  }

  const toExame = () => {
    form.validateFields().then(res => {
      if (!layout.lines?.length && !layout.num) {
        return message.warning('请设置连线')
      }
      setFormData(res || {})
      setTab(TabEnum.test)
    }).catch(err => {
      console.log('err', err)
    })
  }

  const submitResult = (value) => {
    console.log(131, value)
    setStuLines(value.lines)
  }

  console.log('stuLines', stuLines)

  const pmyLook = () => {
    Modal.confirm({
      title: '输入密码',
      content: (
        <Form form={pswForm}>
          <Form.Item
            name="psw"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        pswForm.validateFields().then(res => {
          pswForm.resetFields()
          if (res.psw === pmyma) {
            const lastLight = [...stuLightLines]
            setStuLinesLook(layout.lines)
            setStuLightLines([])
            setTimeout(() => {
              setStuLinesLook([])
              setStuLightLines(lastLight)
            }, 1000)
          } else {
            message.error('密码错误')
          }
        })
      },
    })
  }

  console.log('layout', layout, stuLightLines)

  return (
    <>
      <GlobalStyle />
      <Container>
        {tab === TabEnum.home && (
          <Form layout="vertical" form={form}>
            <Form.Item
              name={'zNumber'}
              label="请选择接线柱数量"
              tooltip="导线数量为接线柱数量减1"
              rules={[{ required: true, message: '请选择接线柱数量' }]}
            >
              <Radio.Group
                style={{ display: 'flex', gap: 20, width: 300, flexWrap: 'wrap' }}
                options={[
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                  { value: 6, label: '6' },
                ]}
              />
            </Form.Item>

            {zNumber && <Form.Item
              name={'lNumber'}
              label="请选择导线数量"
              rules={[{ required: true, message: '请选择导线数量' }]}
              dependencies={['zNumber']}
            >
              <Radio.Group
                style={{ display: 'flex', gap: 20, width: 300, flexWrap: 'wrap' }}
                options={new Array(zNumber - 1).fill('').map((e, index) => ({
                  value: index + 1,
                  label: index + 1,
                }))}
              />
            </Form.Item>}

            {/* <Form.Item name={'zNumberInput'} label='自定义数量'>
              <InputNumber placeholder='手动输入' style={{ width: '150px' }} />
            </Form.Item> */}

            {/* <Form.Item
              label="预览并设置布局"
              tooltip="再次连接两个已连接的线将会取消连接"
            >
              <Line isPreview value={layout} onChange={setLayout} />
            </Form.Item> */}
            <div></div>
            <Row style={{ gap: 12, marginTop: 50 }} justify={'center'}>
              <Button onClick={reset}>重置布局</Button>
              <Button type="primary" onClick={toExame}>
                开考
              </Button>
            </Row>
          </Form>
        )}
        {tab === TabEnum.test && (
          <>
            <Line
              value={layout}
              isPreview={false}
              testLightLines={stuLightLines[stuLightLines?.length - 1]} // 取最后一次
              testLines={stuLinesLook}
              onChange={testLine}
            />
            <Row style={{ gap: 12, width: 550, justifyContent: 'center' }}>
              <div>
                测试情况：
                <div
                  style={{
                    border: '1px solid #f0f0f0',
                    width: 100,
                    height: 200,
                    overflow: 'auto',
                    padding: 12,
                    textAlign: 'left',
                  }}
                >
                  {stuLightLines.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: 12 }}>
                      {item[0]} - {item[1]}{' '}
                      {(item?.length === 2 && canConnect(layout.lines, item[0], item[1])) ? '亮' : '不亮'}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                检验结果:
                <Line
                  isPreview
                  showLight={false}
                  value={{
                    ...layout,
                    lines: stuLines
                  }}
                  onChange={submitResult}
                />
              </div>
            </Row>
            <Row style={{ gap: 12 }}>
              <Button onClick={pmyLook}>偷瞄答案</Button>
              <Button onClick={preStep}>取消考试</Button>
              <Button type="primary" onClick={submit}>
                测试结束，提交答案
              </Button>
            </Row>
          </>
        )}
        {tab === TabEnum.result && (
          <div>
            {
              isSuccess?(
                <Result
                  status="success"
                  title="恭喜你!"
                  subTitle="真棒，朋友，未来可期！"
                />
                ): (
                  <Result
                    status="warning"
                    title="略有遗憾!"
                    subTitle="成功的路上还需努力！"
                />
              )
            }
            <Row style={{ gap: 12 }}>
              <Button onClick={() => {
                setTab(TabEnum.test)
              }}>返回继续测试</Button>
              <Button type="primary" onClick={() => setTab(TabEnum.result)}>
                重新考试
              </Button>
              <Button danger onClick={stopExame}>
                结束考试（由潘老师亲手操作）
              </Button>
            </Row>
          </div>
        )}
      </Container>
    </>
  )
}
