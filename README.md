# Hazen Zoom

Personalized class zoom link dashboard for students/teachers at Hazen High School<sup>1</sup>. Create your own dashboard at [https://hazen.launchto.me](https://hazen.launchto.me)

[**DEMO!**](http://localhost:3000/demo)

![Example of Hazen Zoom dashbaord](https://user-images.githubusercontent.com/20099646/92957175-fd0d7280-f41c-11ea-8596-b6f775031cc9.JPG)

This custom dashbaords feature:

- Consolidated zoom links.
- Your upcoming class will be displayed with its Zoom join button (based on your schedule and the current time).
- Visting https://hazen.launchto.me/<YOUR_CUSTOM_URL>/go, you will be automatically redirected to your upcoming class's zoom link.
- Quick links to important sites such as Canvas, Hazen's website, schedule change form, etc.
- Bell Schedule

Zoom links are collected through web scraping [Hazen High School's website](https://hazen.rentonschools.us/class-of-2020/links-to-zoom-classrooms)<sup>2</sup>.

## Install

Clone the repository: `git clone https://github.com/garytou2/hazen-zoom`

If you would like to connect your own database, create your own firebase project and change the config in [`src/firebase.js`](src/firebase.js)

`npm install`

`npm run start`

**Firebase Realtime Database rules:**

```JSON
{
	"rules": {
		".read": true,
		".write": false,
		"registrations": {
			".read": true,
			".write": "!data.exists()",
			"$username": {
				".read": true,
				".write": "!data.exists()"
			}
		},
		"inital": {
			".read": true,
			"$userInital": {
				".read": true,
				".write": "!data.exists()",
				".validate": "newData.isBoolean()"
			}
		},
		"data": {
			".read": true,
			".write": false
		}
	}
}
```

Note: `.write` for `data` will need to be toggled to `true` if saving new Data web scraping website.

## Built with

- React ([Create React App](https://reactjs.org/docs/create-a-new-react-app.html))
- Firebase ([Realtime Database](https://firebase.google.com/docs/database))
- [Ant Design](https://ant.design/) as UI framework
- [`bad-words`](https://www.npmjs.com/package/bad-words) to keep inputs clean

---

[1]: This was _NOT_ built at the request of Hazen High School or Renton School District. This was just a small personal side project!

[2]: Zoom links were removed from the website on Monday, 9/14/2020. Dashboards are now using data cached from 9/11/2020 10am PDT.

Inspired by [`sarthaktexas/zoom-dashbaord`](https://github.com/sarthaktexas/zoom-dashboard)
