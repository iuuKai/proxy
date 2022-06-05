/*
 * @Author: iuukai
 * @Date: 2022-06-05 18:31:08
 * @LastEditors: iuukai
 * @LastEditTime: 2022-06-06 00:59:37
 * @FilePath: \vercel\proxy\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
const path = require('path')
const axios = require('axios')
const express = require('express')

async function consturctServer() {
	const app = express()
	app.set('trust proxy', true)

	/**
	 * CORS & Preflight request
	 */
	app.use((req, res, next) => {
		if (req.path !== '/' && !req.path.includes('.')) {
			res.set({
				'Access-Control-Allow-Credentials': true,
				'Access-Control-Allow-Origin': req.headers.origin || '*',
				'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
				'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
				'Content-Type': 'application/json; charset=utf-8'
			})
		}
		req.method === 'OPTIONS' ? res.status(204).end() : next()
	})

	/**
	 * Body Parser and File Upload
	 */
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	/**
	 * Serving static files
	 */
	app.use(express.static(path.join(__dirname, '/public')))

	app.use('/proxy', async (req, res) => {
		try {
			// 过滤的头属性，因为只能 req.headers 拿到所有头信息，然后再把不需要的过滤掉
			const disallowedList = [
				'host',
				'connection',
				'content-length',
				'sec-ch-ua',
				'sec-ch-ua-mobile',
				'user-agent',
				'sec-ch-ua-platform',
				'origin',
				'sec-fetch-site',
				'sec-fetch-mode',
				'sec-fetch-dest',
				'referer',
				'accept-encoding',
				'accept-language',
				'if-none-match'
			]
			const headers = {}
			const { url } = req.query
			for (const header in req.headers) {
				// 过滤掉不需要的头
				if (!disallowedList.includes(header)) {
					headers[header] = req.headers[header]
				}
			}
			const moduleResponse = await axios[req.method.toLocaleLowerCase()](url, req.body, { headers })
			res.send(moduleResponse.data)
		} catch (moduleResponse) {
			if (!moduleResponse.body) {
				res.status(404).send({
					code: 404,
					data: null,
					msg: 'Not Found'
				})
				return
			}
			res.status(moduleResponse.status).send(moduleResponse.body)
		}
	})

	return app
}

async function serveNcmApi() {
	const port = Number(process.env.PORT || '3000')
	const host = process.env.HOST || ''

	const constructServerSubmission = consturctServer()

	const app = await constructServerSubmission

	const appExt = app
	appExt.server = app.listen(port, host, () => {
		console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
	})

	return appExt
}

serveNcmApi()
