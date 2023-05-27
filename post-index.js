// Parse text
var videoRegex = new RegExp(`<a href="?.+">video<\/a>`)
var linkRegex = new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)', 'gi')///https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi)

function parseText(txt)
{
    var result = txt + "\n\n " // To hopefully try and fix another issue

    try {
        var markedOutput = marked.parse(txt)
        result = markedOutput
    
        var videoResult = videoRegex.exec(markedOutput)
        if (videoResult != null) {
            videoResult.forEach(element => {
                var linkResult = linkRegex.exec(element)
                result = result.replace(element, `<video controls>\n<source src="${linkResult[0]}" type="video/mp4">\n</video>`)
            })
        }
    } catch (err) {
        result = result + `\n\n<em style="font-size: 15px; color: rgb(255, 127, 127);">This post has a error: ${err}<br>For the full stacktrace, please check the console</em>`
        console.trace(err)
    }

    return result
}

// Create post
function createPost(info) 
{
	document.getElementById("posts").innerHTML = ""
    // Set up post 
    var postDiv = document.createElement("div")

    // Set up user info
    var userInfoDiv = document.createElement("div")

    var userInfoPicture = document.createElement("img")
    userInfoPicture.src = info.user.src
    userInfoPicture.style.width = "48px"
    userInfoPicture.style.height = "48px"
    userInfoPicture.style.borderRadius = "100%"

    var userInfoName = document.createElement("p")
    userInfoName.style.marginTop = "-40px"
    userInfoName.style.marginLeft = "64px"
    userInfoName.innerHTML = `${info.user.name} - Posted ${info.post.date}`

    userInfoDiv.insertAdjacentElement("afterbegin", userInfoPicture)
    userInfoDiv.insertAdjacentElement("beforeend", userInfoName)

    // Set up text
    var textDiv = document.createElement("div")
    textDiv.innerHTML = parseText(info.post.text)

    postDiv.insertAdjacentElement("afterbegin", userInfoDiv)
    postDiv.insertAdjacentElement("beforeend", textDiv)

    document.getElementById("posts").insertAdjacentElement("afterbegin", document.createElement("br"))
    document.getElementById("posts").insertAdjacentElement("afterbegin", postDiv)
}

// Text area update check
    createPost({
      "user": {
         "name": "Voxelstice",
         "src": "https://cdn.discordapp.com/avatars/563639236507729920/e53061b9ad289ecd55449b13a9d007ca.png?size=4096"
      },
      "post": {
         "text": "Simply just type stuff into the big white box and then you'll have output in here. To get JSON, press \"Return json output\".",
         "date": "today"
      }
   })

document.getElementById('username').value = "Voxelstice"
document.getElementById('usericon').value = "https://cdn.discordapp.com/avatars/563639236507729920/e53061b9ad289ecd55449b13a9d007ca.png?size=4096"
document.getElementById('postdate').value = "00/00/0000 00:00 UTC+3"

var area = document.getElementById('markdownoutput')
area.addEventListener('input', function() {
    createPost({
      "user": {
         "name": document.getElementById('username').value,
         "src": document.getElementById('usericon').value
      },
      "post": {
         "text": area.value,
         "date": document.getElementById('postdate').value
      }
   })
}, false)

// Give output json
function givejson()
{
	var json = {
      "user": {
         "name": document.getElementById('username').value,
         "src": document.getElementById('usericon').value
      },
      "post": {
         "text": area.value,
         "date": document.getElementById('postdate').value
      }
   }
	navigator.clipboard.writeText(JSON.stringify(json))
	alert("JSON saved to clipboard.")
}
