
create_table{
    date:HASH,s
    title:RANGE,s
    time:time
    content:
    tags:
}

crud
{
    GET '/'
    res: notes list
}
{
    POST '/addnote/'
    send: {
        title:
        content:
        tags:
    }
    res: now note
}
{
    POST '/deletenote/'
    send: {
        date:
        title:
    }
    res: note deleted
}
{
    POST '/findnote/date'
    send: {
        date:
    }
    res: notes on date
}
{
    POST '/findnote/title'
    send: {
        title:
    }
    res: note with the title
}
{
    POST '/update/'
    send: {
        date:
        title:
        content:
        tags:
    }
    res: note updated
}