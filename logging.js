const start = "10:55:00"
const date = new Date().toDateString()
const startTime = new Date(date + " " + start)
const target = startTime.getTime()


const interval = setInterval(() => {
    if (Date.now() > target) {
        console.log(startTime)
        console.log(new Date())
        clearInterval(interval)
    }
}, 10);
