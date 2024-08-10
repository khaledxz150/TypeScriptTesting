function TSButton(sender, e) {
    const settings: BaladiCallActionOptions = {
        url: "../Home/Privacy",
        data: { text: "hello" },
        processData: true,
        methodtype: 'GET'
    };


    $(document).Baladi_call_action(settings);
}

