function logThe(title , data = false , flag = false) {
    if (flag === false) {
        if (data instanceof Error) {
            flag = '[✕]'
        } else {
            flag = '[✓]'
        }
    } else {
        flag = `[${flag}]`
    }
    let prefix = `${flag} ${title} at ${new Date().toLocaleString()}`
    console.log(prefix , (data) ? data : '');
}

module.exports = {
    logThe
}