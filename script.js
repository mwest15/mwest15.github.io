(function() {
/* global tableau */
	var myConnector = tableau.makeConnector();

myConnector.getSchema = function(schemaCallback) {
	
  var cols = [
    {
      id: "date",
      dataType: tableau.dataTypeEnum.date
    },
    {
      id: "open",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "high",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "low",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "close",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "volume",
      dataType: tableau.dataTypeEnum.int
    }
  ];
  
  var tableSchema = {
    id: "IndstateStockDataConnector",
    alias: "Stock Data",
    columns: cols
  };
  
  schemaCallback([tableSchema]);
  
};

myConnector.getData = function(table, doneCallback) {
	
  var symbol = tableau.connectionData;
  $.getJSON(
     "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
      symbol +
      "&outputsize=full&apikey=KRNUNDM2OUXVBN43",
    function(resp) {
      var data = resp["Time Series (Daily)"],
        tableData = [];
      for (var d in data) {
        tableData.push({
          date: d,
          open: parseFloat(data[d]["1. open"]),
          high: parseFloat(data[d]["2. high"]),
          low: parseFloat(data[d]["3. low"]),
          close: parseFloat(data[d]["4. close"]),
          volume: parseInt(data[d]["5. volume"])
        });
      }
      table.appendRows(tableData);
      doneCallback();
    }
  );
  
};

	tableau.registerConnector(myConnector);

$(document).ready(function() {
  $("#submitButton").click(function() {
      tableau.connectionData = $("#ticker").val();
      tableau.connectionName = "Historical " + $("#ticker").val() + " Data";
      tableau.submit();
  });
  });
})();
