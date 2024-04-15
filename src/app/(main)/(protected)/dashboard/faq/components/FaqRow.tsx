
import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
interface FaqProps {
    id: string;
    question: string;
    answer: string;
    createdAt: Date;
    author: {
        name: string;
    };
}

export default function FaqRow(props: FaqProps) {

    return (


        <div className="flex flex-col justify-between">

            <Accordion>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography>{props.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography color="text.disabled">
                        {props.answer}
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>



    );
}







