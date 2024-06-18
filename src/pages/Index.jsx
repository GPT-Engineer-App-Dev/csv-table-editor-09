import React, { useState } from "react";
import { Container, VStack, Text, Button, Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { FaUpload, FaDownload, FaPlus, FaTrash } from "react-icons/fa";
import Papa from "papaparse";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(result.meta.fields);
          setData(result.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">CSV Upload, Edit, and Download Tool</Text>
        <Button as="label" htmlFor="csvUpload" leftIcon={<FaUpload />} colorScheme="teal">
          Upload CSV
        </Button>
        <Input type="file" id="csvUpload" accept=".csv" onChange={handleFileUpload} display="none" />
        {data.length > 0 && (
          <>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {headers.map((header) => (
                    <Th key={header}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {headers.map((header) => (
                      <Td key={header}>
                        <Input
                          value={row[header] || ""}
                          onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} onClick={() => handleRemoveRow(rowIndex)}>
                        Remove
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} colorScheme="green" onClick={handleAddRow}>
              Add Row
            </Button>
            <Button leftIcon={<FaDownload />} colorScheme="blue" onClick={handleDownload}>
              Download CSV
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;