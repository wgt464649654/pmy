import { GlobalStyle } from './styles/GlobalStyle'

import Test from './components/Test'
import { useEffect, useState } from 'react'
import { TabEnum } from './util'
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
import { AimOutlined } from '@ant-design/icons'
import Line from './components/Line'
import { canConnect, isSame } from './components/Line/util'

export function App() {
  const [tab, setTab] = useState(TabEnum.home)
  const [stuLightLines, setStuLightLines] = useState<any[]>([])
  const [stuLines, setStuLines] = useState<any[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({})

  const layout = formData.layout

  const [form] = Form.useForm()
  const [pswForm] = Form.useForm()

  const tempNum = Form.useWatch('zNumber', form)

  useEffect(() => {
    form.setFieldValue('layout', {
      ...form.getFieldValue('layout'),
      num: tempNum,
    })
  }, [tempNum])

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
          if (res.psw === 'pmyxhwgtdtbs') {
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

  const testLine = value => {
    const { lines = [], lightLines = [] } = value

    if (lightLines?.length === 1) {
      // 添加第一条
      setStuLightLines(e => [...e, lightLines])
    } else if (lightLines?.length === 2) {
      // 替换最后一条
      setStuLightLines(e => [...e.slice(0, e.length - 1), lightLines])
    }

    setStuLines(lines)
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
      const { layout: _layout } = res
      if (!_layout.lines?.length || !_layout.lightLines?.length) {
        return message.warning('请设置连线')
      }
      setFormData(res || {})
      setTab(TabEnum.test)
    }).catch(err => {})
  }

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
                style={{ display: 'flex', gap: 20, maxWidth: 400, flexWrap: 'wrap' }}
                options={[
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                  { value: 6, label: '6' },
                  { value: 7, label: '7' },
                  { value: 8, label: '8' },
                  { value: 9, label: '9' },
                  { value: 10, label: '10' },
                  { value: 11, label: '11' },
                  { value: 12, label: '12' },
                ]}
              />
            </Form.Item>

            {/* <Form.Item name={'zNumberInput'} label='自定义数量'>
              <InputNumber placeholder='手动输入' style={{ width: '150px' }} />
            </Form.Item> */}

            <Form.Item
              name="layout"
              label="预览并设置布局"
              tooltip="再次连接两个已连接的线将会取消连接"
            >
              <Line isPreview />
            </Form.Item>
            <div></div>
            <Row style={{ gap: 12 }} justify={'center'}>
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
              value={{
                ...layout,
                lightLines: stuLightLines[stuLightLines?.length - 1], // 取最后一次
              }}
              isPreview={false}
              testLines={stuLines}
              onChange={testLine}
            />
            <Row style={{ gap: 12, width: 550, justifyContent: 'center' }}>
              <div>
                测试情况：
                <div
                  style={{
                    border: '1px solid #f0f0f0',
                    width: 100,
                    height: 180,
                    overflow: 'auto',
                    padding: 12,
                    textAlign: 'left',
                  }}
                >
                  {stuLightLines.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: 12 }}>
                      {item[0]} - {item[1]}{' '}
                      {canConnect(item, layout?.lines) ? '亮' : '不亮'}
                    </div>
                  ))}
                </div>
              </div>
              {/* <div>
                检验结果:
                <Line
                  isPreview
                  showLight={false}
                  value={{
                    ...layout,
                    ...testLayout,
                    lines: stuLines
                  }}
                  onChange={submitResult}
                />
              </div> */}
            </Row>
            <Row style={{ gap: 12 }}>
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
