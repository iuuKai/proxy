<!--
 * @Author: iuukai
 * @Date: 2022-06-05 23:39:41
 * @LastEditors: iuukai
 * @LastEditTime: 2022-06-06 00:50:44
 * @FilePath: \vercel\proxy\README.md
 * @Description:
 * @QQ/微信: 790331286
-->

# proxy 例子：github api 授权

```js
;(async () => {
	try {
		const url =
			'https://iuukai-proxy.vercel.app/proxy?url=https://github.com/login/oauth/access_token'
		const params = {
			// 回调获取
			code,
			// 你的 oauth 应用 ID
			client_id,
			// 你的 oauth 应用 Secret
			client_secret
		}
		const config = {
			headers: {
				Accept: 'application/json'
			}
		}
		const { data } = await axios.post(url, params, config)
		// 成功获取 access_token
		const accessToken = data['access_token']
		console.log(accessToken)
	} catch (err) {
		console.log(err)
	}
})()
```
