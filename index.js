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

// Post creation stuff
var useFallback = false

var fallbackReq = new XMLHttpRequest()
fallbackReq.open("GET", "https://raw.githubusercontent.com/Voxelstice/voxelblog/posts/config.json")
fallbackReq.send()

fallbackReq.onreadystatechange = (e) => {
    if (fallbackReq.responseText.length != 0) {
        var json = JSON.parse(fallbackReq.responseText)
        if (json.useFallback == true) {
            useFallback = true
        }
    }
}

function getPosts(url)
{
    var requestReceived = false
    var xhr = new XMLHttpRequest()
    xhr.open("GET", url)
    if (useFallback == false) {
        xhr.responseType = "json"
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
        xhr.setRequestHeader("Content-Type", "text/json")
    }
    xhr.send()

    xhr.onreadystatechange = (e) => {
        if (xhr.responseText.length != 0) {
            if (requestReceived == true) { return }
            requestReceived = true

            var json = JSON.parse(xhr.responseText)

            document.getElementById("posts").innerHTML = ""

            json.forEach((element) => {
                createPost(element)
            })
        }
    }
}

setTimeout(() => {
    if (useFallback == true) {
        getPosts("https://raw.githubusercontent.com/Voxelstice/voxelblog/posts/posts.json")
    } else if (useFallback == false) {
        getPosts("https://voxelblog-server.voxelstice.repl.co/get-posts")
    }
}, 1000)
