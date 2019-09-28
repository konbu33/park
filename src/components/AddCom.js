import React from 'react'
import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles';

export default () => {

	const appData = JSON.parse(localStorage.getItem("appData"))

	const init = {
		data: {
			1: { x:  50, y:  50, bg: 'lightgreen' },
			2: { x: 100, y: 100, bg: 'lightgray'  },
			3: { x: 150, y: 150, bg: 'lightblue'  },
		},
		count: 4,
	}

	const [comList, setComList] = useState(appData.data || init.data)
	const [count, setCount] = useState(appData.count || init.count)

	useEffect( () => {
		document.body.oncontextmenu = () => false
		//document.documentElement.classList.add("h100")
		//document.body.classList.add("h100")
		//document.getElementById('root').classList.add("h100")

		document.documentElement.setAttribute("style", "height:100%;")
		//document.documentElement.style.background = "#FFEEDD"
		document.body.style.height = "100%"
		//document.body.style.background = "#FFDDCC"
		document.getElementById('root').style.cssText = "height:100%;"
		//document.getElementById('root').style.background = "#FFCCBB"
	}, [])

	useEffect( () => {
		console.log('change comList: ', comList )
		const appData = {
			data: comList,
			count: count,
		}

		localStorage.setItem("appData",JSON.stringify(appData))
		const newAppData = JSON.parse(localStorage.getItem("appData"))
		console.log('newAppData: ', newAppData)
	}, [comList])

	const onDragEnd= (e, props) => {
		console.log('e.props: ', props)
		console.log('e.id: ', e.target.id, 'e.X: ', e.clientX, 'e.Y: ', e.clientY)
		const id = e.target.id
		const x = e.clientX < 0 ? 1 : e.clientX
		const y = e.clientY < 0 ? 1 : e.clientY
		const bg = props.bg
		const com = { [id]: { x: x, y: y, bg: bg } }
		setComList({ ...comList, ...com })
	}

	const addCom = (e) => {
		e.stopPropagation()
		console.log('addCom currentTarget: ', e.currentTarget)

		const colorList = ['lightgreen', 'lightcyan', 'lightblue', 'lightgray', 'lightyellow', 'lightblue', 'lightpink']
		const bgNo = Math.floor(Math.random() * colorList.length)
		const bg = colorList[bgNo]

		const x = e.clientX < 0 ? 1 : e.clientX
		const y = e.clientY < 0 ? 1 : e.clientY
	
		console.log('addCom: ', e)
		const com = { [count]: { x: x, y: y, bg: bg } }
		//setComList(Object.assign({}, comList, com))
		setCount(count+1)
		setComList({...comList, ...com})
	}

	const delCom = (e) => {
		e.stopPropagation()
		console.log('delCom currentTarget: ', e.currentTarget)
		console.log('delCom: ', e)
		const id = e.target.id
		const state = {...comList}
		delete state[id]
		console.log('c: ', comList)
		console.log('s: ', state)
		setComList({...state})
	}


	const useStyle = makeStyles(
		() => ({
			base: (props) => ({
				position: "absolute",
				top: props.y,
				left: props.x,
				height: "20px",
				width: "20px",
				textAlign: "center",
				background: props.bg,
			}),
			area1: () => ({
			}),
		})
	)

	const Card = (props) => {
		console.log('props: ', props)

		const { base } = useStyle(props)
		console.log('base: ', base)
	
		const { id } = props
		return <div draggable={true} onContextMenu={delCom} onDragEnd={e => onDragEnd(e, props)} id={id} className={base}>{id}</div>
	}

	const { area1 } = useStyle()

	const styles = (props) => {
		console.log('styles: ', props)
		return (
			{
				container: {
					outline: "1px dotted lightgray",
					height: props,
					width: props,
				},
				front: {
					outline: "10px dotted lightgray",
					height: '50%',
					width: '50%',
				}
			}
		)
	}

	const { container, front } = styles('90%')

	return (
		<>
			<div onContextMenu={addCom} className={area1} style={container} >
			{ 
				comList && Object.keys(comList).map( (key) => {
					const { x, y, bg } = comList[key]
					return <Card key={key} id={key} x={x} y={y} bg={bg} />
				})
			}
			</div>
		</>
	)
}

