const wellsData = [
    {
        id: "well1",
        isActive: true, // 進行中的會被排到最上面
        wellName: "Davies 23-14-11 No. 1-Alt",
        location: "Bienville Parish, LA",
        status: "Active Drilling (Lateral)",
        reportDate: "2025/12/15",
        currentMD: 21876,
        currentTVD: 12916,
        plannedVertical: 10082,
        plannedHorizontal: 11677,
        actualVertical: 10082,
        actualHorizontal: 11794,
        costIncurred: 6278680,
        estimatedCost: 6121369,
        rop: 45,
        mudWeight: 16.8,
        dailyNotes: "這裡填寫當日日誌..."
    },
    {
        id: "well2",
        isActive: false,
        wellName: "WY CO 2-35-26HC NO.1",
        location: "Bienville Parish, LA",
        status: "Waiting for rig",
        reportDate: "2025/12/15",
        currentMD: 0,
        currentTVD: 0,
        plannedVertical: 13350,
        plannedHorizontal: 13382,
        actualVertical: 0,
        actualHorizontal: 0,
        costIncurred: 482396,
        estimatedCost: 10986555,
        rop: 0,
        mudWeight: 12.5,
        dailyNotes: "鑽機移入中..."
    }
    // 如果有第三口井，直接在下面增加一個 { ... } 區塊
];