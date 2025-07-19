Dim isDragging, offsetX, offsetY

Sub headerBar_OnMouseDown()
    isDragging = True
    offsetX = window.event.screenX - window.screenLeft
    offsetY = window.event.screenY - window.screenTop
End Sub

Sub document_OnMouseMove()
    If isDragging Then
        window.moveTo window.event.screenX - offsetX, window.event.screenY - offsetY
    End If
End Sub

Sub document_OnMouseUp()
    isDragging = False
End Sub
