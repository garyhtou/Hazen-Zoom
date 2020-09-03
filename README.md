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
      "$username":{
				".read": true,
				".write": "!data.exists()",
      }
    }
  }
}
```
