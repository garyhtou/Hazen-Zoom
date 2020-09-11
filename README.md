# Hazen Zoom

Firebase Realtime Database rules:

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
				".write": "!data.exists()",
			}
		},
		"inital": {
			".read": true,
      "$userInital":{
        ".read": true,
				".write": "!data.exists()",
        ".validate": "newData.isBoolean()",
      }
		},
    "data": {
      ".read": true,
      ".write": false //toggle to true if saving new data from websites
    }
	}
}

```

## Ideas

Clubs as a period
Club announcements/info
News - https://hazen.rentonschools.us/our-school/hazen-news
